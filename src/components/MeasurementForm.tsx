import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import FormField from "./FormField";
import SectionHeader from "./SectionHeader";
import FormSection from "./FormSection";
import { ValidationError, validateMeasurementForm, getFieldError } from "@/utils/formValidation";
import { AlertCircle, Save, RotateCcw, CheckCircle, XCircle, Baby } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { API_CONFIG, getApiUrl } from "@/config/api";

interface MeasurementFormData {
  name: string;
  registerNumber: string;
  phoneNumber: string;
  city: string;
  childName: string;
  childAge: string;
  childGender: string;
  fullLengthShoulderToToe: string;
  shoulderToShoulder: string;
  neckRound: string;
  upperChestRound: string;
  middleChestRound: string;
  waistRound: string;
  hipRound: string;
  fullSleeveLength: string;
  wristRound: string;
  elbowRound: string;
  elbowSleeveLength: string;
  shortSleeveLength: string;
  armRound: string;
  armWholeRound: string;
  waistToToeLength: string;
  waistToKneeLength: string;
  thighRound: string;
  ankleRound: string;
}

const initialFormData: MeasurementFormData = {
  name: "",
  registerNumber: "",
  phoneNumber: "",
  city: "",
  childName: "",
  childAge: "",
  childGender: "",
  fullLengthShoulderToToe: "",
  shoulderToShoulder: "",
  neckRound: "",
  upperChestRound: "",
  middleChestRound: "",
  waistRound: "",
  hipRound: "",
  fullSleeveLength: "",
  wristRound: "",
  elbowRound: "",
  elbowSleeveLength: "",
  shortSleeveLength: "",
  armRound: "",
  armWholeRound: "",
  waistToToeLength: "",
  waistToKneeLength: "",
  thighRound: "",
  ankleRound: "",
};



const MeasurementForm = () => {
  const [formData, setFormData] = useState<MeasurementFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (showErrors) {
      setErrors(prev => prev.filter(error => error.field !== name));
    }
    
    if (formSubmitted) {
      setFormSubmitted(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateMeasurementForm(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setShowErrors(true);
      
      toast.error("Please fix the errors in the form", {
        description: `Found ${validationErrors.length} issue${validationErrors.length > 1 ? 's' : ''} to resolve.`,
        icon: <XCircle className="text-destructive" />
      });
      
      const firstErrorField = document.getElementById(validationErrors[0].field);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(getApiUrl('MEASUREMENTS'), {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      toast.success("Measurements saved successfully!", {
        description: "Your tailoring measurements have been recorded.",
        icon: <CheckCircle className="text-green-500" />
      });
      
      setFormSubmitted(true);
      setErrors([]);
      setShowErrors(false);
    } catch (error) {
      console.error('API Error:', error);
      toast.error("Failed to save measurements", {
        description: "Please try again or contact support.",
        icon: <XCircle className="text-destructive" />
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    const isFormModified = Object.keys(formData).some(key => 
      formData[key as keyof MeasurementFormData] !== initialFormData[key as keyof MeasurementFormData]
    );
    
    if (isFormModified) {
      if (window.confirm("Are you sure you want to reset all measurements?")) {
        resetForm();
      }
    } else {
      resetForm();
    }
  };
  
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors([]);
    setShowErrors(false);
    setFormSubmitted(false);
    toast.info("Form has been reset", {
      description: "All measurement fields have been cleared."
    });
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      {showErrors && errors.length > 0 && (
        <Alert variant="destructive" className="mb-6 animate-shake border border-destructive/50 shadow-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium">Please fix the following issues before submitting:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {errors.slice(0, 3).map((error, index) => (
                <li key={index} className="text-sm">{error.message}</li>
              ))}
              {errors.length > 3 && (
                <li className="text-sm font-medium">...and {errors.length - 3} more issues</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {formSubmitted && (
        <Alert className="mb-6 animate-fade-in bg-green-50 border border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>
            <p className="font-medium">Measurements saved successfully!</p>
            <p className="text-sm mt-1">You can edit your measurements or submit new ones.</p>
          </AlertDescription>
        </Alert>
      )}

      <FormSection index={0} className="bg-gradient-to-b from-white to-blue-50 shadow-sm border-blue-100">
        <SectionHeader 
          title="Personal Information" 
          subtitle="Please provide your contact details"
          className="text-blue-800"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            id="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            error={getFieldError(errors, 'name')}
          />
          <FormField
            id="registerNumber"
            label="Register Number"
            value={formData.registerNumber}
            onChange={handleChange}
            placeholder="Enter register number"
            required
            error={getFieldError(errors, 'registerNumber')}
          />
          <FormField
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
            error={getFieldError(errors, 'phoneNumber')}
          />
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              City
              <span className="text-destructive ml-1">*</span>
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-offset-0 focus:ring-primary/25 focus:border-primary transition-all duration-200"
              required
            >
              <option value="">Select a city</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Pune">Pune</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Surat">Surat</option>
            </select>
            {getFieldError(errors, 'city') && (
              <p className="text-xs text-destructive mt-1 animate-fade-in">
                <AlertCircle className="h-3 w-3 inline-block mr-1" />
                <span>{getFieldError(errors, 'city')}</span>
              </p>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection index={1} className="bg-gradient-to-b from-white to-pink-50 shadow-sm border-pink-100">
        <SectionHeader 
          title="Child Information" 
          subtitle="Information about the child for whom the measurements are being taken"
          className="text-pink-800"
          icon={<Baby className="h-4 w-4 mr-2" />}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            id="childName"
            label="Child's Name"
            value={formData.childName}
            onChange={handleChange}
            placeholder="Enter child's name"
            required
            error={getFieldError(errors, 'childName')}
          />
          <FormField
            id="childAge"
            label="Child's Age"
            type="number"
            value={formData.childAge}
            onChange={handleChange}
            placeholder="Enter age in years"
            min={0}
            max={18}
            required
            error={getFieldError(errors, 'childAge')}
          />
          <div className="space-y-2">
            <label htmlFor="childGender" className="text-sm font-medium">
              Child's Gender
              <span className="text-destructive ml-1">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-all
                ${formData.childGender === 'male' 
                  ? 'bg-blue-100 border-blue-300 text-blue-700 font-medium' 
                  : 'bg-white hover:bg-blue-50'}`}>
                <input
                  type="radio"
                  id="genderMale"
                  name="childGender"
                  value="male"
                  className="sr-only"
                  onChange={handleChange}
                  checked={formData.childGender === 'male'}
                />
                <span>Male</span>
              </label>
              <label className={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-all
                ${formData.childGender === 'female' 
                  ? 'bg-pink-100 border-pink-300 text-pink-700 font-medium' 
                  : 'bg-white hover:bg-pink-50'}`}>
                <input
                  type="radio"
                  id="genderFemale"
                  name="childGender"
                  value="female"
                  className="sr-only"
                  onChange={handleChange}
                  checked={formData.childGender === 'female'}
                />
                <span>Female</span>
              </label>
            </div>
            {getFieldError(errors, 'childGender') && (
              <p className="text-xs text-destructive mt-1 animate-fade-in">
                <AlertCircle className="h-3 w-3 inline-block mr-1" />
                <span>{getFieldError(errors, 'childGender')}</span>
              </p>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection index={2} className="bg-gradient-to-b from-white to-purple-50 shadow-sm border-purple-100">
        <SectionHeader 
          title="Upper Body Measurements" 
          subtitle="All measurements should be in inches"
          className="text-purple-800"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            id="fullLengthShoulderToToe"
            label="Full Length (Shoulder to Toe)"
            type="number"
            value={formData.fullLengthShoulderToToe}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'fullLengthShoulderToToe')}
          />
          <FormField
            id="shoulderToShoulder"
            label="Shoulder to Shoulder"
            type="number"
            value={formData.shoulderToShoulder}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'shoulderToShoulder')}
          />
          <FormField
            id="neckRound"
            label="Neck Round"
            type="number"
            value={formData.neckRound}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'neckRound')}
          />
          <FormField
            id="upperChestRound"
            label="Upper Chest Round"
            type="number"
            value={formData.upperChestRound}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'upperChestRound')}
          />
          <FormField
            id="middleChestRound"
            label="Middle Chest Round"
            type="number"
            value={formData.middleChestRound}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'middleChestRound')}
          />
          <FormField
            id="waistRound"
            label="Waist Round"
            type="number"
            value={formData.waistRound}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'waistRound')}
          />
          <FormField
            id="hipRound"
            label="Hip Round"
            type="number"
            value={formData.hipRound}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'hipRound')}
          />
        </div>
      </FormSection>

      <FormSection index={3} className="bg-gradient-to-b from-white to-green-50 shadow-sm border-green-100">
        <SectionHeader 
          title="Arm Measurements" 
          subtitle="All measurements should be in inches"
          className="text-green-800"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            id="fullSleeveLength"
            label="Full Sleeve Length"
            type="number"
            value={formData.fullSleeveLength}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'fullSleeveLength')}
          />
          <FormField
            id="wristRound"
            label="Wrist Round"
            type="number"
            value={formData.wristRound}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'wristRound')}
          />
          <FormField
            id="elbowRound"
            label="Elbow Round"
            type="number"
            value={formData.elbowRound}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'elbowRound')}
          />
          <FormField
            id="elbowSleeveLength"
            label="Elbow Sleeve Length"
            type="number"
            value={formData.elbowSleeveLength}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'elbowSleeveLength')}
          />
          <FormField
            id="shortSleeveLength"
            label="Short Sleeve Length"
            type="number"
            value={formData.shortSleeveLength}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'shortSleeveLength')}
          />
          <FormField
            id="armRound"
            label="Arm Round"
            type="number"
            value={formData.armRound}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'armRound')}
          />
          <FormField
            id="armWholeRound"
            label="Arm Whole Round"
            type="number"
            value={formData.armWholeRound}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'armWholeRound')}
          />
        </div>
      </FormSection>

      <FormSection index={4} className="bg-gradient-to-b from-white to-amber-50 shadow-sm border-amber-100">
        <SectionHeader 
          title="Leg Measurements" 
          subtitle="All measurements should be in inches"
          className="text-amber-800"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            id="waistToToeLength"
            label="Waist to Toe Length"
            type="number"
            value={formData.waistToToeLength}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'waistToToeLength')}
          />
          <FormField
            id="waistToKneeLength"
            label="Waist to Knee Length"
            type="number"
            value={formData.waistToKneeLength}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'waistToKneeLength')}
          />
          <FormField
            id="thighRound"
            label="Thigh Round"
            type="number"
            value={formData.thighRound}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'thighRound')}
          />
          <FormField
            id="ankleRound"
            label="Ankle Round"
            type="number"
            value={formData.ankleRound}
            onChange={handleChange}
            unit="inches"
            min={0}
            error={getFieldError(errors, 'ankleRound')}
          />
        </div>
      </FormSection>

      <div className="flex justify-end gap-4 mt-8 mb-20 opacity-0 animate-slide-in-up" style={{ '--delay': 5 } as React.CSSProperties}>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset}
          className="transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 group"
        >
          <RotateCcw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
          Reset
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 min-w-[120px] shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Measurements
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default MeasurementForm;
