import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Eye, ThumbsUp } from 'lucide-react';
import { mockFAQs, mockCategories } from '../mockData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const topFAQs = [...mockFAQs].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Câu hỏi thường gặp</h2>
        <p className="text-gray-600 mt-1">
          Tìm câu trả lời nhanh cho các vấn đề phổ biến
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              placeholder="Tìm kiếm câu hỏi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-base"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setSelectedCategory}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          {mockCategories.map(cat => (
            <TabsTrigger key={cat} value={cat}>
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {/* Top FAQs */}
          {selectedCategory === 'all' && searchTerm === '' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="size-5 text-blue-600" />
                  Câu hỏi phổ biến nhất
                </CardTitle>
                <CardDescription>
                  Các câu hỏi được xem nhiều nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topFAQs.map((faq, index) => (
                    <div
                      key={faq.id}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="flex items-center justify-center size-8 shrink-0 bg-blue-600 text-white rounded-full font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900">{faq.question}</h4>
                        <div className="flex items-center gap-3 mt-2 text-sm text-blue-700">
                          <span className="flex items-center gap-1">
                            <Eye className="size-4" />
                            {faq.views} lượt xem
                          </span>
                          <Badge variant="outline">{faq.category}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* FAQ List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCategory === 'all' ? 'Tất cả câu hỏi' : selectedCategory}
              </CardTitle>
              <CardDescription>
                {filteredFAQs.length} câu hỏi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Search className="size-12 mx-auto mb-3 text-gray-400" />
                  <p>Không tìm thấy câu hỏi phù hợp</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex-1 pr-4">
                          <div className="font-medium mb-2">{faq.question}</div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                            <span>{faq.departmentName}</span>
                            <span className="flex items-center gap-1">
                              <Eye className="size-3" />
                              {faq.views}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {faq.answer}
                          </p>
                          <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                            <p>Phòng ban: {faq.departmentName}</p>
                            <p>
                              Cập nhật: {new Date(faq.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Help Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-2">Không tìm thấy câu trả lời?</h3>
          <p className="text-gray-700 mb-4">
            Nếu câu hỏi của bạn chưa có trong danh sách, hãy gửi kiến nghị để được hỗ trợ trực tiếp.
          </p>
          <div className="text-sm text-gray-600">
            <p>📧 Email: vpso@nghean.edu.vn</p>
            <p>📞 Hotline: 0238.3842.176</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
