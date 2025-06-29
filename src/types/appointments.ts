export interface AppointmentData {
  clientName: string;
  service: string;
  time: string;
  price: string;
  comment: string;
  date: string;
}

export interface Appointment extends AppointmentData {
    id: number;
}

export interface AppointmentFormProps {
  date: Date;
  onSave: (data: AppointmentData) => void;
  onClose: () => void;
  initialData?: AppointmentData;
}