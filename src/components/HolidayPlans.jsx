import React, { useState } from 'react';
import Calendar from './Calendar';

const HolidayPlans = () => {
  const [plans, setPlans] = useState([]);

  return (
    <div className="flex justify-center">
      <div className="w-full">
        <Calendar setPlans={setPlans} plans={plans} />
      </div>
    </div>
  );
};

export default HolidayPlans;
