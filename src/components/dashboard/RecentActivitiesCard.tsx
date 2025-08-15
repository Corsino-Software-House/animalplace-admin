import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { 
  User, 
  DollarSign, 
  CalendarDays, 
  Settings,
  RefreshCw
} from 'lucide-react';
import { getRecentActivity, RecentActivityResponse } from '@/services/get-recent-activity';

export function RecentActivitiesCard() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { 
    data: activityData, 
    isLoading, 
    error,
    refetch 
  } = useQuery<RecentActivityResponse>({
    queryKey: ['recent-activity', currentPage],
    queryFn: () => getRecentActivity(currentPage, itemsPerPage),
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: false,
  });

  const activities = activityData?.activities || [];
  const pagination = activityData?.pagination;

  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'payment':
        return <DollarSign className="w-4 h-4" />;
      case 'appointment':
      case 'calendar':
        return <CalendarDays className="w-4 h-4" />;
      case 'settings':
        return <Settings className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    if (!pagination) return [];
    
    const { currentPage, totalPages } = pagination;
    const pages = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4);
        if (totalPages > 5) pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        if (totalPages > 5) pages.push('...');
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Atividades Recentes
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            <p>Erro ao carregar atividades</p>
            <Button variant="outline" onClick={() => refetch()} className="mt-2">
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Atividades Recentes
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(itemsPerPage)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 py-2 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-48 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : activities && activities.length > 0 ? (
            <>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                        {getActivityIcon(activity.icon)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.type}</p>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{activity.timeAgo}</span>
                  </div>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => pagination.hasPreviousPage && handlePageChange(currentPage - 1)}
                          className={!pagination.hasPreviousPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>

                      {generatePageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === '...' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => handlePageChange(page as number)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => pagination.hasNextPage && handlePageChange(currentPage + 1)}
                          className={!pagination.hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              {pagination && (
                <div className="text-center text-xs text-gray-500 mt-2">
                  Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} a{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de{' '}
                  {pagination.totalItems} atividades
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma atividade recente encontrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
