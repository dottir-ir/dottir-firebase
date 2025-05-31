import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { CaseService } from '../../services/CaseService';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';
export const SaveButton = ({ caseId, initialSaveCount, initialIsSaved = false, onSaveChange, }) => {
    const [saveCount, setSaveCount] = useState(initialSaveCount);
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [isLoading, setIsLoading] = useState(false);
    const { currentUser } = useAuth();
    const caseService = new CaseService();
    useEffect(() => {
        const checkSaveStatus = async () => {
            if (!currentUser?.uid)
                return;
            try {
                const saved = await caseService.isSaved(caseId, currentUser.uid);
                setIsSaved(saved);
            }
            catch (error) {
                console.error('Error checking save status:', error);
            }
        };
        checkSaveStatus();
    }, [caseId, currentUser?.uid]);
    const handleSave = async () => {
        if (!currentUser?.uid) {
            toast.error('Please sign in to save cases');
            return;
        }
        setIsLoading(true);
        try {
            if (isSaved) {
                await caseService.unsaveCase(caseId, currentUser.uid);
                setSaveCount(prev => prev - 1);
                setIsSaved(false);
                onSaveChange?.(saveCount - 1, false);
            }
            else {
                await caseService.saveCase(caseId, currentUser.uid);
                setSaveCount(prev => prev + 1);
                setIsSaved(true);
                onSaveChange?.(saveCount + 1, true);
            }
        }
        catch (error) {
            console.error('Error toggling save:', error);
            toast.error('Failed to update save status');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs(Button, { variant: "ghost", size: "sm", onClick: handleSave, disabled: isLoading, className: `flex items-center space-x-1 ${isSaved ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-500 hover:text-gray-600'}`, children: [_jsx(Bookmark, { className: `w-5 h-5 ${isSaved ? 'fill-current' : ''}` }), _jsx("span", { children: saveCount })] }));
};
