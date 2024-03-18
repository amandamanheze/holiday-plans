import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import YearView from './YearView';
import jsPDF from 'jspdf';
import { Box, Input, Textarea } from '@chakra-ui/react';

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventParticipants, setEventParticipants] = useState('');
  const [selectEvent, setSelectEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const handleSelectSlot = (slotInfo) => {
    setShowModal(true);
    setSelectedDate(slotInfo.start);
    setSelectEvent(null);
    clearEventFields();
  };

  const handleSelectedEvent = (event) => {
    setShowModal(true);
    setSelectEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description);
    setEventLocation(event.location);
    setEventParticipants(event.participants);
  };

  const clearEventFields = () => {
    setEventTitle('');
    setEventDescription('');
    setEventLocation('');
    setEventParticipants('');
  };

  const saveEvent = () => {
    if (eventTitle && selectedDate) {
      if (selectEvent) {
        const updatedEvent = { ...selectEvent, title: eventTitle, description: eventDescription, location: eventLocation, participants: eventParticipants };
        const updatedEvents = events.map((event) =>
          event === selectEvent ? updatedEvent : event
        );
        setEvents(updatedEvents);
      } else {
        const newEvent = {
          title: eventTitle,
          start: selectedDate,
          end: moment(selectedDate)
            .add(1, 'hours')
            .toDate(),
          description: eventDescription,
          location: eventLocation,
          participants: eventParticipants,
        };
        setEvents([...events, newEvent]);
      }
      setShowModal(false);
      setEventTitle('');
      setEventDescription('');
      setEventLocation('');
      setEventParticipants('');
      setSelectEvent(null);
      clearEventFields();
    }
  };

  const deleteEvent = (event) => {
    const updatedEvents = events.filter((evt) => evt !== event);
    setEvents(updatedEvents);
    setShowModal(false);
    clearEventFields();
    setSelectEvent(null);
  };

  const MonthEvent = ({ event }) => (
    <div className='text-sm'>
      <div className="font-semibold">{event.title}</div>
      <div>{event.description}</div>
      <div>{event.location}</div>
      <div>{event.participants}</div>
    </div>
  );

  const downloadCard = event => {
    const doc = new jsPDF();
  
    doc.setFont('helvetica');
    doc.setFontSize(12);
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 10, 180, 100, 'F');
    doc.setTextColor(0, 0, 0);
  
    const cardContent = `
      Title: ${event.title}\n
      Description: ${event.description}\n
      Start: ${event.start.toLocaleString()}\n
      End: ${event.end.toLocaleString()}\n
      Location: ${event.location}\n
      Participants: ${event.participants}
    `;

    const lines = doc.splitTextToSize(cardContent, 180)
    doc.text(15, 15, lines);

    const fileName = `${event.title.replace(/ /g, '_')}_${event.start.toLocaleDateString().replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  };
  
  return (
    <Box minHeight='300vh' p={4}>
      <Box maxW='800px' mx='auto' p={4}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          selectable
          length={365}
          views={{
            month: true,
            day: true,
            week: true,
            year: YearView,
          }}
          style={{ height: 500 }}
          messages={{ year: 'Year', width: '20%' }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectedEvent}
          eventPropGetter={
            (event, start, end, isSelected) => {
              let newStyle = {
                backgroundColor: "darkcyan",
              };
        
              return {
                className: "",
                style: newStyle
              };
            }
          }
          components={{
            event: MonthEvent,
          }}
        />
        {events.length > 0 && (
        <div className='flex flex-wrap gap-4'>
          <h2 className='bg-gray-300 tracking-tighter font-semibold p-2 w-full rounded mt-1'>ALL YOUR PLANS</h2>
          {events.map((event, index) => (
            <div key={index} className='bg-gray-200 p-4 rounded shadow-lg border border-gray-300 hover:bg-gray-300'>
              <p><i>Title: </i><b>{event.title}</b></p>
              {event.description && ( 
                <p><i>Description: </i>{event.description}</p>
              )}
              <p><i>{event.start.toLocaleString()} to {event.end.toLocaleString()}</i></p>
              {event.location && (
                <p><i>Location: </i>{event.location}</p>
              )}
              {event.participants && (
                <p><i>Participants: </i>{event.participants}</p>
              )}
              <div className='flex center mt-4'>
                <button onClick={() => handleSelectedEvent(event)} 
                  className='text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2'> Edit </button>
                <button onClick={() => deleteEvent(event)}
                  className='text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2'> Delete </button>
                <button onClick={() => downloadCard(event)} className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2'>
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"/>
                </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
        {showModal && (
          <div
            className='modal'
            style={{
              display: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'fixed',
              zIndex: 999999,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <div className='bg-gray-100 h-auto inline-block rounded mt-52' style={{ width: '30%' }}>
              <div className='bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-0 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 tracking-tighter font-semibold p-1 w-full rounded'>
                <h5 className='mt-4 mb-3'>
                  {selectEvent ? 'Edit Event' : 'Add New Plan'}
                </h5>
              </div>
              <div className='w-full'>
                <div className='bg-white rounded px-14 pt-3 pb-4'>
                  <label htmlFor='eventTitle' className='block text-gray-700 text-sm font-bold mb-2'>
                    Title <p className='inline text-red-500 text-sm'>*</p>
                  </label>
                  <input
                    type='text'
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='eventTitle'
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    required
                  />
                </div>
                <div className='bg-white px-14 pt-2 pb-3'>
                  <label className='block text-gray-700 text-sm font-bold mb-2'> Description </label>
                  <Textarea
                    id='eventDescription'
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  />
                </div>
                <div className='bg-white px-36 pb-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2'> Location </label>
                  <Input
                    type='text'
                    id='eventLocation'
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  />
                </div>
                <div className='bg-white px-60 pb-6'>
                  <label className='block text-gray-700 text-sm font-bold mb-2'> Participants </label>
                  <Input
                    type='number'
                    min='0'
                    id='eventParticipants'
                    value={eventParticipants}
                    onChange={(e) => setEventParticipants(e.target.value)}
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  />
                </div>
                <div className='bg-white pb-3 rounded'>
                  {selectEvent && (
                    <button 
                      type='button'
                      className='text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2'
                      onClick={() => deleteEvent(selectEvent)}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type='button'
                    className='text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-500 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2'
                    onClick={saveEvent}
                  >
                    Save
                  </button>
                  <button class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-0 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEventTitle('');
                    setSelectEvent(null);
                  }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default BigCalendar;
