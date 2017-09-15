import React from 'react';

const Dashboard = (props) => {

    return(

      <div>
        <h2 style= {{
          textAlign:'center',
          fontSize: '32px',
          fontFamily: 'Lobster Two'
        }}> { localStorage.getItem('message') }</h2>
      </div>

    );

}
export default Dashboard;
