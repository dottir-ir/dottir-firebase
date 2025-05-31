import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { VerificationRequestList } from '../../components/admin/VerificationRequestList';
import { VerificationRequestDetail } from '../../components/admin/VerificationRequestDetail';
const VerificationRequests = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "", element: _jsx(VerificationRequestList, {}) }), _jsx(Route, { path: ":id", element: _jsx(VerificationRequestDetail, {}) })] }));
};
export default VerificationRequests;
