import { Appliance } from '@/types/appliance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Settings, 
  AlertTriangle, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { calculateWarrantyEndDate, getWarrantyStatus, formatDate } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

interface ApplianceCardProps {
  appliance: Appliance;
  onEdit: (appliance: Appliance) => void;
  onView: (appliance: Appliance) => void;
}

export const ApplianceCard = ({ appliance, onEdit, onView }: ApplianceCardProps) => {
  const warrantyEndDate = calculateWarrantyEndDate(appliance.purchaseDate, appliance.warrantyDurationMonths);
  const warrantyStatus = getWarrantyStatus(appliance.purchaseDate, appliance.warrantyDurationMonths);
  
  const upcomingTasks = appliance.maintenanceTasks.filter(task => task.status === 'Upcoming').length;
  const overdueTasks = appliance.maintenanceTasks.filter(task => task.status === 'Overdue').length;

  const getWarrantyBadgeVariant = () => {
    switch (warrantyStatus) {
      case 'Active': return 'default';
      case 'Expiring Soon': return 'secondary';
      case 'Expired': return 'destructive';
      default: return 'default';
    }
  };

  const getWarrantyIcon = () => {
    switch (warrantyStatus) {
      case 'Active': return <CheckCircle className="h-4 w-4" />;
      case 'Expiring Soon': return <Clock className="h-4 w-4" />;
      case 'Expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => onView(appliance)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              {appliance.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {appliance.brand} • {appliance.model}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(appliance);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Warranty Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getWarrantyIcon()}
            <span className="text-sm font-medium">Warranty</span>
          </div>
          <Badge variant={getWarrantyBadgeVariant()}>
            {warrantyStatus}
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Expires: {formatDate(warrantyEndDate)}
        </div>

        {/* Maintenance Summary */}
        {appliance.maintenanceTasks.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Maintenance</span>
            </div>
            <div className="flex gap-1">
              {overdueTasks > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {overdueTasks} overdue
                </Badge>
              )}
              {upcomingTasks > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {upcomingTasks} upcoming
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Purchase Info */}
        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
          Purchased: {formatDate(appliance.purchaseDate)}
          {appliance.purchaseLocation && ` • ${appliance.purchaseLocation}`}
        </div>
      </CardContent>
    </Card>
  );
};