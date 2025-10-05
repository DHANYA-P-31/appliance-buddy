import { useState } from 'react';
import { Appliance } from '@/types/appliance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface ApplianceFormProps {
  appliance?: Appliance;
  onSave: (appliance: Omit<Appliance, 'id' | 'supportContacts' | 'maintenanceTasks' | 'linkedDocuments'>) => void;
  onCancel: () => void;
}

export const ApplianceForm = ({ appliance, onSave, onCancel }: ApplianceFormProps) => {
  const [formData, setFormData] = useState({
    name: appliance?.name || '',
    brand: appliance?.brand || '',
    model: appliance?.model || '',
    purchaseDate: appliance?.purchaseDate.toISOString().split('T')[0] || '',
    warrantyDurationMonths: appliance?.warrantyDurationMonths || 12,
    serialNumber: appliance?.serialNumber || '',
    purchaseLocation: appliance?.purchaseLocation || '',
    notes: appliance?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Appliance name is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    } else {
      const purchaseDate = new Date(formData.purchaseDate);
      const today = new Date();
      if (purchaseDate > today) {
        newErrors.purchaseDate = 'Purchase date cannot be in the future';
      }
    }

    if (formData.warrantyDurationMonths < 1) {
      newErrors.warrantyDurationMonths = 'Warranty duration must be at least 1 month';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave({
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      purchaseDate: new Date(formData.purchaseDate),
      warrantyDurationMonths: formData.warrantyDurationMonths,
      serialNumber: formData.serialNumber.trim() || undefined,
      purchaseLocation: formData.purchaseLocation.trim() || undefined,
      notes: formData.notes.trim() || undefined
    });
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{appliance ? 'Edit Appliance' : 'Add New Appliance'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Appliance Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Samsung Refrigerator"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    placeholder="e.g., Samsung"
                    className={errors.brand ? 'border-destructive' : ''}
                  />
                  {errors.brand && <p className="text-sm text-destructive">{errors.brand}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    placeholder="e.g., RF28R7351SG"
                    className={errors.model ? 'border-destructive' : ''}
                  />
                  {errors.model && <p className="text-sm text-destructive">{errors.model}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => handleChange('serialNumber', e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Purchase Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Purchase Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date *</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => handleChange('purchaseDate', e.target.value)}
                    className={errors.purchaseDate ? 'border-destructive' : ''}
                  />
                  {errors.purchaseDate && <p className="text-sm text-destructive">{errors.purchaseDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyDurationMonths">Warranty Duration (months) *</Label>
                  <Input
                    id="warrantyDurationMonths"
                    type="number"
                    min="1"
                    value={formData.warrantyDurationMonths}
                    onChange={(e) => handleChange('warrantyDurationMonths', parseInt(e.target.value) || 0)}
                    className={errors.warrantyDurationMonths ? 'border-destructive' : ''}
                  />
                  {errors.warrantyDurationMonths && <p className="text-sm text-destructive">{errors.warrantyDurationMonths}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="purchaseLocation">Purchase Location</Label>
                  <Input
                    id="purchaseLocation"
                    value={formData.purchaseLocation}
                    onChange={(e) => handleChange('purchaseLocation', e.target.value)}
                    placeholder="e.g., Best Buy, Amazon"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any additional notes about this appliance..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {appliance ? 'Update Appliance' : 'Add Appliance'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};