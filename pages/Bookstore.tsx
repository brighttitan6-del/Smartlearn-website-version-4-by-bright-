import React, { useState } from 'react';
import { MOCK_BOOKS } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import { Book } from '../types';

export const Bookstore: React.FC = () => {
  const { user, buyBook, buyBooks } = useAuth();
  const [buyingBook, setBuyingBook] = useState<Book | null>(null);
  const [isBuyingAll, setIsBuyingAll] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [readingBook, setReadingBook] = useState<Book | null>(null);

  const hasPurchased = (bookId: string) => {
    return user?.role === 'TEACHER' || user?.purchasedBooks?.includes(bookId);
  };

  // Calculate unowned books
  const unownedBooks = MOCK_BOOKS.filter(b => !hasPurchased(b.id));
  const totalBuyAllPrice = unownedBooks.reduce((sum, book) => sum + book.price, 0);

  const handleBuy = async () => {
    if (buyingBook && phoneNumber) {
      await buyBook(buyingBook.id);
      setBuyingBook(null);
      setPhoneNumber('');
    }
  };

  const handleBuyAll = async () => {
    if (unownedBooks.length > 0 && phoneNumber) {
      await buyBooks(unownedBooks.map(b => b.id));
      setIsBuyingAll(false);
      setPhoneNumber('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Smartlearn Bookstore</h1>
            <p className="text-slate-600 dark:text-slate-400">Purchase required textbooks and read them directly on the platform.</p>
          </div>
          
          {unownedBooks.length > 0 && (
            <button
              onClick={() => setIsBuyingAll(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <span>Buy All ({unownedBooks.length})</span>
              <span className="bg-black/20 px-2 py-0.5 rounded text-sm">MWK {totalBuyAllPrice.toLocaleString()}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_BOOKS.map((book) => {
            const owned = hasPurchased(book.id);
            return (
              <div key={book.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden relative group">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    {owned && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">OWNED</div>
                    )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-xs text-primary-600 font-semibold mb-1 uppercase">{book.category}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 leading-tight">{book.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{book.author}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                        {owned ? 'Purchased' : `MWK ${book.price.toLocaleString()}`}
                    </span>
                    {owned ? (
                         <button 
                           onClick={() => setReadingBook(book)}
                           className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800"
                         >
                             Read Now
                         </button>
                    ) : (
                        <button 
                           onClick={() => setBuyingBook(book)}
                           className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                        >
                            Buy
                        </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note Section */}
        <div className="mt-16 p-8 bg-primary-50 dark:bg-slate-900/50 rounded-2xl border border-primary-100 dark:border-slate-800 text-center">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Looking for Lesson Notes?</h2>
             <p className="text-slate-600 dark:text-slate-400 mb-4">
                 Supplementary notes for specific video lessons are available for free to all subscribed students on the Lesson details page.
             </p>
             <a href="/lessons" className="text-primary-600 font-semibold hover:underline">Go to Lessons &rarr;</a>
        </div>
      </div>

      {/* Payment Modal (Handles both single buy and buy all) */}
      {(buyingBook || isBuyingAll) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl animate-scale-in">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {isBuyingAll ? 'Purchase All Available Books' : 'Purchase Book'}
                </h3>
                
                {isBuyingAll ? (
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    You are buying <span className="font-bold">{unownedBooks.length} books</span> for a total of <span className="font-bold text-primary-600">MWK {totalBuyAllPrice.toLocaleString()}</span>.
                  </p>
                ) : (
                   <p className="text-slate-600 dark:text-slate-300 mb-4">
                    You are buying <span className="font-bold">{buyingBook?.title}</span> for <span className="font-bold text-primary-600">MWK {buyingBook?.price.toLocaleString()}</span>.
                  </p>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Money Number</label>
                        <input 
                            type="tel" 
                            placeholder="099..." 
                            className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button 
                          onClick={isBuyingAll ? handleBuyAll : handleBuy}
                          disabled={!phoneNumber}
                          className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50"
                        >
                            Confirm Payment
                        </button>
                        <button 
                          onClick={() => { setBuyingBook(null); setIsBuyingAll(false); setPhoneNumber(''); }}
                          className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Reader Modal */}
      {readingBook && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col">
              <div className="border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center bg-white dark:bg-slate-900">
                  <div>
                      <h2 className="font-bold text-lg text-slate-900 dark:text-white">{readingBook.title}</h2>
                      <p className="text-xs text-slate-500">Reading Mode</p>
                  </div>
                  <button onClick={() => setReadingBook(null)} className="text-slate-500 hover:text-red-500">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full prose dark:prose-invert">
                  <p className="lead">This is a preview of the book content. In a real application, the PDF or ePub content would render here.</p>
                  <h3>Chapter 1: Introduction</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  <h3>Chapter 2: Core Concepts</h3>
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 my-8">
                      <strong>Note:</strong> This content is protected by copyright. Do not distribute.
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};