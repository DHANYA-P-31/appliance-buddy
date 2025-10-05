import { useState } from 'react';
import { useAppliances } from '@/hooks/useAppliances';
import { ApplianceCard } from '@/components/ApplianceCard';
import { ApplianceForm } from '@/components/ApplianceForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Home, 
  AlertTriangle,
  Clock,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { Appliance } from '@/types/appliance';
import { getWarrantyStatus } from '@/utils/dateUtils';

const Index = () => {
  const { appliances, loading, error, addAppliance, updateAppliance, resetToSampleData, refetch } = useAppliances();
  const [showForm, setShowForm] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'expired' | 'expiring' | 'active'>('all');

  const filteredAppliances = appliances.filter(appliance => {
    const matchesSearch = 
      appliance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appliance.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appliance.model.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    
    const warrantyStatus = getWarrantyStatus(appliance.purchaseDate, appliance.warrantyDurationMonths);
    
    switch (filter) {
      case 'expired': return warrantyStatus === 'Expired';
      case 'expiring': return warrantyStatus === 'Expiring Soon';
      case 'active': return warrantyStatus === 'Active';
      default: return true;
    }
  });

  const stats = {
    total: appliances.length,
    expired: appliances.filter(a => getWarrantyStatus(a.purchaseDate, a.warrantyDurationMonths) === 'Expired').length,
    expiring: appliances.filter(a => getWarrantyStatus(a.purchaseDate, a.warrantyDurationMonths) === 'Expiring Soon').length,
    active: appliances.filter(a => getWarrantyStatus(a.purchaseDate, a.warrantyDurationMonths) === 'Active').length,
  };

  const handleSave = async (applianceData: Omit<Appliance, 'id' | 'supportContacts' | 'maintenanceTasks' | 'linkedDocuments'>) => {
    try {
      if (editingAppliance) {
        await updateAppliance(editingAppliance.id, applianceData);
      } else {
        await addAppliance(applianceData);
      }
      setShowForm(false);
      setEditingAppliance(undefined);
    } catch (error) {
      // Error is already handled in the hook, just prevent form from closing
      console.error('Failed to save appliance:', error);
    }
  };

  const handleEdit = (appliance: Appliance) => {
    setEditingAppliance(appliance);
    setShowForm(true);
  };

  const handleView = (appliance: Appliance) => {
    // TODO: Navigate to detail view
    console.log('View appliance:', appliance);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your appliances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Home className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Home Appliance Tracker</h1>
                <p className="text-muted-foreground">Keep track of warranties and maintenance</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetToSampleData}
                className="gap-2"
                size="sm"
              >
                Reset to Sample Data
              </Button>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Appliance
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border-b border-destructive/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">{error}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refetch}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Home className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Appliances</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Active Warranties</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">{stats.expiring}</p>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{stats.expired}</p>
                  <p className="text-sm text-muted-foreground">Expired Warranties</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appliances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
              size="sm"
            >
              Active
            </Button>
            <Button
              variant={filter === 'expiring' ? 'default' : 'outline'}
              onClick={() => setFilter('expiring')}
              size="sm"
            >
              Expiring
            </Button>
            <Button
              variant={filter === 'expired' ? 'default' : 'outline'}
              onClick={() => setFilter('expired')}
              size="sm"
            >
              Expired
            </Button>
          </div>
        </div>

        {/* Appliances Grid */}
        {filteredAppliances.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {appliances.length === 0 ? 'No appliances yet' : 'No appliances match your search'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {appliances.length === 0 
                  ? 'Add your first appliance to start tracking warranties and maintenance.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {appliances.length === 0 && (
                <Button onClick={() => setShowForm(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Appliance
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppliances.map(appliance => (
              <ApplianceCard
                key={appliance.id}
                appliance={appliance}
                onEdit={handleEdit}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <ApplianceForm
          appliance={editingAppliance}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingAppliance(undefined);
          }}
        />
      )}
    </div>
  );
};

export default Index;