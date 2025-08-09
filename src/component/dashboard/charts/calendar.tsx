import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import styled from '@emotion/styled';

const StyleWrapper = styled.div`
  th a {
    color: black;
  }
  .fc-toolbar-title {
    font-size: 1.25rem;
  }
  .fc-button {
    background-color: #1f75f6;
    :hover {
      background-color: #0061f3;
    }
  }
  .fc-button-active {
    background-color: #0061f3;
  }
  .fc-timegrid-slot-label {
    background-color: #f8f8f8;
    color: #7a7a7a;
    text-transform: uppercase;
  }
  .fc-timegrid-slot-lane {
    height: 6rem !important;
  }
`;

const Calendar = () => {
  return (
    <StyleWrapper>
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin]}
        initialView="timeGridWeek"
        weekends={true}
        editable={true}
        selectable={true}
        themeSystem="standard"
        events={[]}
        height={'600px'}
        timeZone="UTC"
        slotDuration={'01:00:00'}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
      />
    </StyleWrapper>
  );
};

export default Calendar;
