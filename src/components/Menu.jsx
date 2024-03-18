import React from 'react';

const Menu = ({ onMenuClick }) => {
  return (
    <div className="text-center font-semibold font-lato">
      <h2 className='text-teal-500 mt-16' onClick={() => onMenuClick('plans')}>Holiday Plans</h2>
      <h2 className='tracking-tight text-gray-500 m-8 bg-indigo-50 rounded p-3 inline-block'>Manage your holidays, add events and have control over all your plans.</h2>
    </div>
  );
};

export default Menu;
