export default function Billing() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-white px-4">
            <div className="max-w-md w-full text-center">

                {/* Main Heading */}
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Billing System Update in Progress
                </h1>

                {/* Subheading */}
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    We're currently enhancing our billing infrastructure to provide you with a better experience. This section will be available shortly.
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                    <div className="bg-blue-600 h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>

                {/* Status Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center space-x-2 text-blue-700">
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-sm font-medium">UNDER CONSTRUCTION</span>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="text-sm text-gray-500">
                    <p className="mb-1">For urgent billing inquiries, please contact:</p>
                    <p className="font-medium text-gray-700">it.department@cebucficoop.com</p>
                    <p className="text-xs mt-2">Expected completion: Soon</p>
                </div>
            </div>
        </div>
    );
}