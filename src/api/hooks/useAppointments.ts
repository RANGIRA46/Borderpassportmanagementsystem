import { useState, useCallback } from 'react';
import appointmentApi, { AvailabilityParams } from '../endpoints/appointmentApi';
import {
  AppointmentResponse,
  AppointmentRequest,
  AppointmentSlot,
  PaginationParams,
  PaginatedResponse,
  ApiException,
} from '../client/types';

interface AppointmentState {
  appointments: PaginatedResponse<AppointmentResponse> | null;
  selectedAppointment: AppointmentResponse | null;
  availableSlots: AppointmentSlot[];
  loading: boolean;
  error: string | null;
}

interface UseAppointmentsReturn extends AppointmentState {
  fetchAppointments: (params?: PaginationParams) => Promise<void>;
  fetchAppointment: (id: string) => Promise<void>;
  bookAppointment: (data: AppointmentRequest) => Promise<AppointmentResponse | null>;
  updateAppointment: (id: string, data: Partial<AppointmentRequest>) => Promise<AppointmentResponse | null>;
  cancelAppointment: (id: string, reason?: string) => Promise<boolean>;
  fetchAvailability: (params?: AvailabilityParams) => Promise<void>;
  clearError: () => void;
  clearSelected: () => void;
}

export function useAppointments(): UseAppointmentsReturn {
  const [state, setState] = useState<AppointmentState>({
    appointments: null,
    selectedAppointment: null,
    availableSlots: [],
    loading: false,
    error: null,
  });

  const setLoading = (loading: boolean) =>
    setState((prev) => ({ ...prev, loading }));

  const setError = (error: string | null) =>
    setState((prev) => ({ ...prev, error, loading: false }));

  const fetchAppointments = useCallback(async (params?: PaginationParams): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const appointments = await appointmentApi.list(params);
      setState((prev) => ({ ...prev, appointments, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load appointments.';
      setError(message);
    }
  }, []);

  const fetchAppointment = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const selectedAppointment = await appointmentApi.getById(id);
      setState((prev) => ({ ...prev, selectedAppointment, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load appointment details.';
      setError(message);
    }
  }, []);

  const bookAppointment = useCallback(async (data: AppointmentRequest): Promise<AppointmentResponse | null> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const appointment = await appointmentApi.create(data);
      setState((prev) => ({
        ...prev,
        loading: false,
        appointments: prev.appointments
          ? {
              ...prev.appointments,
              data: [appointment, ...prev.appointments.data],
              total: prev.appointments.total + 1,
            }
          : null,
      }));
      return appointment;
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to book appointment.';
      setError(message);
      return null;
    }
  }, []);

  const updateAppointment = useCallback(
    async (id: string, data: Partial<AppointmentRequest>): Promise<AppointmentResponse | null> => {
      try {
        setLoading(true);
        setState((prev) => ({ ...prev, error: null }));
        const updated = await appointmentApi.update(id, data);
        setState((prev) => ({
          ...prev,
          loading: false,
          selectedAppointment: prev.selectedAppointment?.id === id ? updated : prev.selectedAppointment,
          appointments: prev.appointments
            ? { ...prev.appointments, data: prev.appointments.data.map((a) => (a.id === id ? updated : a)) }
            : null,
        }));
        return updated;
      } catch (err) {
        const message = err instanceof ApiException ? err.message : 'Failed to update appointment.';
        setError(message);
        return null;
      }
    },
    []
  );

  const cancelAppointment = useCallback(async (id: string, reason?: string): Promise<boolean> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      await appointmentApi.cancel(id, reason);
      setState((prev) => ({
        ...prev,
        loading: false,
        appointments: prev.appointments
          ? {
              ...prev.appointments,
              data: prev.appointments.data.map((a) =>
                a.id === id ? { ...a, status: 'cancelled' as const } : a
              ),
            }
          : null,
        selectedAppointment:
          prev.selectedAppointment?.id === id
            ? { ...prev.selectedAppointment, status: 'cancelled' as const }
            : prev.selectedAppointment,
      }));
      return true;
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to cancel appointment.';
      setError(message);
      return false;
    }
  }, []);

  const fetchAvailability = useCallback(async (params?: AvailabilityParams): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const availableSlots = await appointmentApi.getAvailability(params);
      setState((prev) => ({ ...prev, availableSlots, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load available slots.';
      setError(message);
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearSelected = useCallback(() => {
    setState((prev) => ({ ...prev, selectedAppointment: null }));
  }, []);

  return {
    ...state,
    fetchAppointments,
    fetchAppointment,
    bookAppointment,
    updateAppointment,
    cancelAppointment,
    fetchAvailability,
    clearError,
    clearSelected,
  };
}

export default useAppointments;
