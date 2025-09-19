// إزالة import React from 'react';
const DashboardPage = () => {
  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>Welcome to your accounting dashboard. Here you can see an overview of your financial data.</p>
      {/* يمكنك إضافة رسوم بيانية وموجزات هنا */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>Total Revenue</h3>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>$0.00</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>Total Expenses</h3>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>$0.00</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>Profit/Loss</h3>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>$0.00</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>Accounts Balance</h3>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>$0.00</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
