import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Handbooks from '../pages/handbooks/Handbooks';
import Companies from '../pages/handbooks/Companies';
import CompanyForm from '../pages/handbooks/CompanyForm';

const HandbookRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Handbooks />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/companies/new" element={<CompanyForm />} />
      <Route path="/companies/:id/edit" element={<CompanyForm />} />
      {/* Add more handbook routes as needed */}
      <Route path="*" element={<Navigate to="/handbooks" replace />} />
    </Routes>
  );
};

export default HandbookRoutes; 