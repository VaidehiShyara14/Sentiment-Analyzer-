// pages/index.js
import { useState } from "react"
import SentimentChart from "../components/SentimentChart"

export default function Home() {
  const [review, setReview] = useState("")
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [explanation, setExplanation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("single")

  const handleSingleSubmit = async () => {
    if (!review.trim()) return

    setLoading(true)
    const formData = new FormData()
    formData.append("review", review)

    try {
      const res = await fetch("http://localhost:5000/api/sentiment", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setResult(data)

      const expRes = await fetch("http://localhost:5000/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: review, sentiment: data.sentiment }),
      })
      const expData = await expRes.json()
      setExplanation(expData.explanation)
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkSubmit = async () => {
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("http://localhost:5000/api/bulk_sentiment", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setResult(data)
      setExplanation(null)
    } catch (error) {
      console.error("Error analyzing bulk sentiment:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment) => {
    return sentiment === "Positive"
      ? "bg-green-50 text-green-700 border-green-200"
      : sentiment === "Negative"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-gray-50 text-gray-700 border-gray-200"
  }

  const getSentimentEmoji = (sentiment) => {
    return sentiment === "Positive" ? "😊" : sentiment === "Negative" ? "😞" : "😐"
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-8 px-4 md:py-16 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-md mb-4">
            <span className="text-2xl">🧠</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">Sentiment Analyzer</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Understand how users feel about your product with powerful AI-driven sentiment analysis
          </p>
        </div>

{/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab("single")}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm ${
                activeTab === "single"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="text-sm">📝</span>
              <span>Single Review</span>
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm ${
                activeTab === "bulk"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="text-sm">📊</span>
              <span>Bulk Analysis</span>
            </button>
          </div>

{/* Single Review Tab */}
          {activeTab === "single" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">Analyze Individual Review</h2>
                  <p className="text-gray-500 text-sm mb-4">Enter a product review to analyze its sentiment</p>
                  <textarea
                    className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                    placeholder="Write a review here... (e.g., 'I love this product, it works exactly as described!')"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={handleSingleSubmit}
                    disabled={loading || !review.trim()}
                    className={`w-full py-2 px-4 rounded-lg flex items-center justify-center font-medium transition-colors ${
                      loading || !review.trim()
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">➤</span>
                        Analyze Sentiment
                      </>
                    )}
                  </button>
                </div>
              </div>

              {result && !Array.isArray(result) && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                  <div
                    className={`h-2 ${
                      result.sentiment === "Positive"
                        ? "bg-green-500"
                        : result.sentiment === "Negative"
                          ? "bg-red-500"
                          : "bg-gray-500"
                    }`}
                  ></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">Analysis Result</h2>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(
                          result.sentiment,
                        )}`}
                      >
                        {result.sentiment} {getSentimentEmoji(result.sentiment)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Confidence Score</span>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.abs(parseFloat(result.polarity)).toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            result.sentiment === "Positive"
                              ? "bg-green-500"
                              : result.sentiment === "Negative"
                                ? "bg-red-500"
                                : "bg-gray-500"
                          }`}
                          style={{ width: `${Math.abs(parseFloat(result.polarity)) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {explanation && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">AI Explanation</h4>
                        <p className="text-sm text-gray-600">{explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

{/* Bulk Analysis Tab */}
          {activeTab === "bulk" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">Bulk Sentiment Analysis</h2>
                  <p className="text-gray-500 text-sm mb-4">
                    Upload a CSV file with multiple reviews for batch analysis
                  </p>

                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <span className="text-3xl block mx-auto text-gray-400 mb-2">📤</span>
                    <p className="text-sm text-gray-600 mb-4">Drag and drop your CSV file here, or click to browse</p>
                    <input
                      type="file"
                      id="file-upload"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <button
                      onClick={() => document.getElementById("file-upload").click()}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                      Select CSV File
                    </button>
                    {file && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: <span className="font-medium">{file.name}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={handleBulkSubmit}
                    disabled={loading || !file}
                    className={`w-full py-2 px-4 rounded-lg flex items-center justify-center font-medium transition-colors ${
                      loading || !file
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">📊</span>
                        Analyze Bulk Data
                      </>
                    )}
                  </button>
                </div>
              </div>

              {result && Array.isArray(result) && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-1">Sentiment Distribution</h2>
                      <p className="text-gray-500 text-sm mb-4">Visual breakdown of sentiment analysis results</p>
                      <div className="h-[300px]">
                        <SentimentChart results={result} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-1">Individual Results</h2>
                      <p className="text-gray-500 text-sm mb-4">Detailed breakdown of each review analysis</p>
                      <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                        {result.map((item, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border ${getSentimentColor(
                              item.sentiment,
                            )} transition-all hover:shadow-md`}
                          >
                            <p className="font-medium text-gray-800 mb-2 line-clamp-2">{item.review}</p>
                            <div className="flex justify-between items-center">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(
                                  item.sentiment,
                                )}`}
                              >
                                {item.sentiment} {getSentimentEmoji(item.sentiment)}
                              </span>
                              <span className="text-xs font-medium">
                                Confidence: {Math.abs(parseFloat(item.polarity)).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}