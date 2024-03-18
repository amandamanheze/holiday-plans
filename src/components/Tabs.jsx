import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import HolidayPlans from './HolidayPlans';

export default function ColorTab() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }} className='bg-gray-100 text-center'>
      <Tabs centered
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
      <Tab label="plans" />
      </Tabs>
      {value === 0 && (
        <div>
          <HolidayPlans/>
        </div>
      )}
    </Box>
  );
}
