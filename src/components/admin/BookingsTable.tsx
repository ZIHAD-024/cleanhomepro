import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Search, RefreshCw, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  notes: string | null;
  status: string;
  created_at: string;
  customer: {
    id: string;
    full_name: string;
    phone: string;
    email: string | null;
    address: string | null;
  } | null;
  service: {
    id: string;
    name: string;
    base_price: number | null;
  } | null;
}

interface StatusHistory {
  id: string;
  old_status: string | null;
  new_status: string;
  changed_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  in_progress: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const BookingsTable = ({ onUpdate }: { onUpdate: () => void }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("bookings")
        .select(`
          id,
          booking_date,
          booking_time,
          notes,
          status,
          created_at,
          customer:customers(id, full_name, phone, email, address),
          service:services(id, name, base_price)
        `)
        .order("booking_date", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Booking status changed to ${newStatus}`,
      });

      fetchBookings();
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const fetchStatusHistory = async (bookingId: string) => {
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from("booking_status_history")
        .select("*")
        .eq("booking_id", bookingId)
        .order("changed_at", { ascending: false });

      if (error) throw error;
      setStatusHistory(data || []);
    } catch (error) {
      console.error("Error fetching status history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const viewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    fetchStatusHistory(booking.id);
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.customer?.full_name.toLowerCase().includes(searchLower) ||
      booking.customer?.phone.includes(searchTerm) ||
      booking.service?.name.toLowerCase().includes(searchLower) ||
      booking.id.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, phone, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchBookings}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {format(new Date(booking.booking_date), "MMM d, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.booking_time.slice(0, 5)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.customer?.full_name || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.customer?.phone || "N/A"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.service?.name || "N/A"}</p>
                      {booking.service?.base_price && (
                        <p className="text-sm text-muted-foreground">
                          ${booking.service.base_price}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[booking.status] || "bg-gray-100"}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={booking.status}
                        onValueChange={(value) => updateBookingStatus(booking.id, value)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => viewBookingDetails(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              ID: {selectedBooking?.id.slice(0, 8)}...
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedBooking.customer?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedBooking.customer?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedBooking.customer?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium">{selectedBooking.service?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedBooking.booking_date), "MMMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedBooking.booking_time.slice(0, 5)}</p>
                </div>
              </div>
              {selectedBooking.customer?.address && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedBooking.customer.address}</p>
                </div>
              )}
              {selectedBooking.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{selectedBooking.notes}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Status History</p>
                {historyLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : statusHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No status changes recorded</p>
                ) : (
                  <div className="space-y-2">
                    {statusHistory.map((history) => (
                      <div
                        key={history.id}
                        className="flex items-center justify-between text-sm bg-muted p-2 rounded"
                      >
                        <span>
                          {history.old_status || "New"} → {history.new_status}
                        </span>
                        <span className="text-muted-foreground">
                          {format(new Date(history.changed_at), "MMM d, HH:mm")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsTable;
