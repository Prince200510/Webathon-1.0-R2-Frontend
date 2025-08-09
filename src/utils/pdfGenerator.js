import jsPDF from 'jspdf';

export const generatePDF = (title, content, subject) => {
  const pdf = new jsPDF();
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize(title, 180);
  let currentY = 30;
  titleLines.forEach(line => {
    pdf.text(line, 15, currentY);
    currentY += 10;
  });
  currentY += 5;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'italic');
  pdf.text(`Subject: ${subject}`, 15, currentY);
  
  currentY += 15;
  let processedContent = content
    .replace(/^# (.*$)/gm, '$1')
    .replace(/^## (.*$)/gm, '\n$1')
    .replace(/^### (.*$)/gm, '\n$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^- (.*$)/gm, '• $1')
    .replace(/\n\n\n+/g, '\n\n');
  
  const lines = processedContent.split('\n');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  lines.forEach(line => {
    if (line.trim() === '') {
      currentY += 5;
      return;
    }
    
    if (line.match(/^[A-Z][^.]*$/) && line.length < 50 && !line.startsWith('•')) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
    } else if (line.startsWith('•')) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
    }
    
    const wrappedLines = pdf.splitTextToSize(line, 180);
    
    wrappedLines.forEach(wrappedLine => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = 30;
      }
      
      pdf.text(wrappedLine, 15, currentY);
      currentY += 6;
    });
    
    currentY += 2;
  });
  
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`, 15, 285);
    pdf.text('EdTech Platform - AI Study Notes', 120, 285);
  }
  
  const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
  pdf.save(fileName);
};

export const generateAdvancedPDF = (title, content, subject) => {
  const pdf = new jsPDF();
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 0, 210, 40, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  
  const titleLines = pdf.splitTextToSize(title, 180);
  let titleY = 20;
  titleLines.forEach(line => {
    pdf.text(line, 15, titleY);
    titleY += 8;
  });
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Subject: ${subject}`, 15, titleY + 5);
  pdf.setTextColor(0, 0, 0);
  let currentY = 60;
  const sections = content.split(/^#+ /gm);
  
  sections.forEach((section, index) => {
    if (index === 0 && section.trim() === '') return;
    
    const lines = section.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return;
    if (index > 0) {
      if (currentY > 250) {
        pdf.addPage();
        currentY = 30;
      }
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(245, 245, 245);
      pdf.rect(10, currentY - 5, 190, 12, 'F');
      pdf.text(lines[0], 15, currentY + 3);
      currentY += 20;
      
      lines.slice(1).forEach(line => {
        if (line.trim() === '') {
          currentY += 3;
          return;
        }
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        
        if (line.startsWith('- ')) {
          line = '• ' + line.substring(2);
        }
        
        if (line.includes('**')) {
          const parts = line.split(/\*\*(.*?)\*\*/);
          let xPosition = 15;
          
          parts.forEach((part, partIndex) => {
            if (partIndex % 2 === 0) {
              pdf.setFont('helvetica', 'normal');
            } else {
              pdf.setFont('helvetica', 'bold');
            }
            
            if (part.trim()) {
              const wrappedLines = pdf.splitTextToSize(part, 180 - (xPosition - 15));
              wrappedLines.forEach((wrappedLine, lineIndex) => {
                if (currentY > 270) {
                  pdf.addPage();
                  currentY = 30;
                  xPosition = 15;
                }
                
                pdf.text(wrappedLine, xPosition, currentY);
                if (lineIndex < wrappedLines.length - 1) {
                  currentY += 6;
                  xPosition = 15;
                } else {
                  xPosition += pdf.getTextWidth(wrappedLine);
                }
              });
            }
          });
          currentY += 6;
        } else {
          const wrappedLines = pdf.splitTextToSize(line, 180);
          wrappedLines.forEach(wrappedLine => {
            if (currentY > 270) {
              pdf.addPage();
              currentY = 30;
            }
            pdf.text(wrappedLine, 15, currentY);
            currentY += 6;
          });
        }
        
        currentY += 2;
      });
    }
  });
  
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(128, 128, 128);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(15, 280, 195, 280);
    pdf.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 15, 285);
    pdf.text(`Page ${i} of ${pageCount}`, 160, 285);
    pdf.text('EdTech Platform - AI Study Notes', 15, 290);
  }
  
  const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
  pdf.save(fileName);
};
