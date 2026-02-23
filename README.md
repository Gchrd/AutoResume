# AutoResume

AutoResume is a modern, privacy-first CV builder built with Next.js and Tailwind CSS. It empowers users to create professional, ATS-friendly resumes instantly without account registration or cloud storage.

**Demo:** https://auto-resume-ric.vercel.app/

## Features

### CV Builder
- **Real-time Preview**: See your changes instantly as you type in a split-screen editor.
- **Privacy First**: All data is stored locally in your browser (localStorage). No servers, no tracking.
- **ATS Friendly**: Generates a clean, single-column layout optimized for Application Tracking Systems.
- **PDF Export**: Download high-quality A4 PDFs using the browser's native print engine.
- **Customizable**:
  - **Accent Colors**: Choose a theme color that matches your personal brand.
  - **Custom Sections**: Add any number of custom sections (Projects, Awards, Volunteering, etc.).
- **Smart Inputs**: Intelligent fields like the LinkedIn profile input that auto-formats URLs.
- **Responsive Design**: Works on desktop and mobile (with toggleable preview).

### CV Scanner (AI-Powered)
- **PDF Upload**: Upload any CV/Resume in PDF format.
- **AI Parsing**: Uses Google Gemini AI to intelligently read and extract all data from the CV.
- **Adaptive Section Detection**: Automatically detects section headers in any language or format.
- **CSV Export**: Download the extracted data as a structured CSV file, ready for use in Excel or Google Sheets.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Google Gemini API](https://ai.google.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key (free from [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Gchrd/AutoResume.git
    cd AutoResume/cv-app
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env.local` file in the `cv-app` directory:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Building a CV
1.  Fill in your details on the left panel (Personal Info, Experience, Education, etc.).
2.  Use the "Customize" tab to change the accent color.
3.  Need more space? Add "Custom Sections" for anything unique to you.
4.  Click the "Download PDF" button to save your CV.

### Scanning a CV
1.  Click "Scan Existing CV" on the homepage or navigate to `/scanner`.
2.  Upload a PDF file of any CV/Resume.
3.  Click "Scan CV" and wait for the AI to process it (5-10 seconds).
4.  Review the extracted data in the table.
5.  Click "Download CSV" to export the data.

Note: Only PDF format is supported for scanning. The Gemini API key is required for this feature.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
