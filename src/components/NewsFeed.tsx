import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type NewsItem = {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
};

type NewsFeedProps = {
  news: NewsItem[];
  isLoading: boolean;
};

const NewsFeed: React.FC<NewsFeedProps> = ({ news, isLoading }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  const getSentimentBadge = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    if (!sentiment) return null;
    
    const colors = {
      positive: 'bg-green-100 text-green-800',
      negative: 'bg-red-100 text-red-800',
      neutral: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded ${colors[sentiment]}`}>
        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto News</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {news.map((item) => (
              <a 
                key={item.id} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {item.imageUrl && (
                  <div className="flex-shrink-0">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>{item.source}</div>
                    <div className="flex items-center space-x-2">
                      {getSentimentBadge(item.sentiment)}
                      <span>{formatDate(item.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsFeed;
