"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, DollarSign, Calendar, Users } from "lucide-react";

export function ScholarshipPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem("scholarship-popup-seen");
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("scholarship-popup-seen", "true");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <GraduationCap className="h-6 w-6 text-green-600" />
            Scholarship Opportunity
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <Badge className="bg-green-600 text-white mb-2">Limited Time</Badge>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              500 Half Scholarships Available!
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              For the 2025-2026 Academic Year
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>50% Tuition Fee Reduction</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-green-600" />
              <span>Academic Year 2025-2026</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-green-600" />
              <span>Available for All Programs</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Don't miss this opportunity to pursue world-class education at reduced cost!</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                handleClose();
                window.location.href = "/apply";
              }}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Apply Now
            </Button>
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Learn More
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}