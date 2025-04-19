import { ETicketPriority, ETicketStatus } from '@/enums/ticket.enums';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { CiClock1 } from 'react-icons/ci';
import { GrInProgress } from 'react-icons/gr';
import { MdOutlinePending, MdOutlineTaskAlt } from 'react-icons/md';

export const getPriorityTag = (priority?: ETicketPriority) => {
  return priority === ETicketPriority.LOW
    ? 'blue'
    : priority === ETicketPriority.MEDIUM
    ? 'orange'
    : priority === ETicketPriority.HIGH
    ? 'red'
    : priority === ETicketPriority.URGENT
    ? 'purple'
    : 'gray';
};
export const getStatusTag = (status?: ETicketStatus) => {
  return status === ETicketStatus.OPEN
    ? 'green'
    : status === ETicketStatus.IN_PROGRESS
    ? 'blue'
    : status === ETicketStatus.RESOLVED
    ? 'orange'
    : 'red';
};

export const getStatusTicket = (status?: string, isTask?: boolean) => {
  if (isTask) {
    status = status?.toUpperCase();
  }
  switch (status) {
    case ETicketStatus.RESOLVED:
      return {
        icon: <MdOutlineTaskAlt className='w-6 !text-orange-500' />,
        color: 'orange',
        label: 'TICKET.RESOLVED',
      };
    case ETicketStatus.CLOSED:
      return {
        icon: <AiOutlineCloseCircle className='w-6 !text-error' />,
        color: 'error',
        label: 'TICKET.CLOSED',
      };
    case ETicketStatus.IN_PROGRESS:
      return {
        icon: <GrInProgress className='w-6 !text-blue' />,
        color: 'blue',
        label: 'TICKET.INPROGRESS',
      };
    case ETicketStatus.OPEN:
      return {
        icon: <CiClock1 className='w-6 !text-success' />,
        color: 'success',
        label: 'TICKET.OPEN',
      };
    default:
      return {
        icon: <MdOutlinePending className='w-6 !text-gray-500' />,
        color: 'default',
        label: '',
      };
  }
};

export { default as TicketInformation } from '../../MyTaskTemplate/partials/TaskInformation';
export { default as TicketWorkflow } from '../../MyTaskTemplate/partials/TaskWorkflow';
export * from './context';
export { default as CreateUpdateTicketModal } from './CreateUpdateTicket';
export { default as RenderEditor } from './RenderEditor';
export { default as TicketComment } from './TicketComment';
export { default as TicketContentOuter } from './TicketContentOuter';
export { default as TicketList } from './TicketList';
export { default as UpdateLabelTicket } from './UpdateLabelTicket';
