# AutoResume

AutoResume is a modern, privacy-first CV builder built with Next.js and Tailwind CSS. It empowers users to create professional, ATS-friendly resumes instantly without account registration or cloud storage.

**Demo:** https://auto-resume-ric.vercel.app/

![AutoResume UI](https://via.placeholder.com/800x400?text=AutoResume+Preview) *(Replace with actual screenshot)*

## Features

- **Real-time Preview**: See your changes instantly as you type in a split-screen editor.
- **Privacy First**: All data is stored locally in your browser (localStorage). No servers, no tracking.
- **ATS Friendly**: Generates a clean, single-column layout optimized for Application Tracking Systems.
- **PDF Export**: Download high-quality A4 PDFs using the browser's native print engine.
- **Customizable**:
  - **Accent Colors**: Choose a theme color that matches your personal brand.
  - **Custom Sections**: Add any number of custom sections (Projects, Awards, Volunteering, etc.).
- **Smart Inputs**: Intelligent fields like the LinkedIn profile input that auto-formats URLs.
- **Responsive Design**: Works on desktop and mobile (with toggleable preview).

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/autoresume.git
    cd autoresume/cv-app
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1.  **Edit**: Fill in your details on the left panel (Personal Info, Experience, Education, etc.).
2.  **Customize**: Use the "Customize" tab to change the accent color.
3.  **Add Sections**: Need more space? Add "Custom Sections" for anything unique to you.
4.  **Download**: Click the "Download PDF" button to save your CV.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
