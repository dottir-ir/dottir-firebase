import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { CaseList } from '@/components/cases/CaseList';
export function CasesPage() {
    return (_jsxs("div", { className: "container mx-auto py-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Medical Cases" }), _jsx(CaseList, {})] }));
}
