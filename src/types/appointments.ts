export interface AppointmentData {
  clientName: string;
  service: string;
  time: string;
  price: string;
  comment: string;
}

export interface Appointment extends AppointmentData {
    date: string;
}

export interface AppointmentFormProps {
  date: Date;
  onSave: (data: AppointmentData) => void;
  onClose: () => void;
}