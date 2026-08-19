import jsPDF from 'jspdf';
import { FinalInterviewReport, PracticeTestReport } from '../types';

export function exportInterviewReportPDF(report: FinalInterviewReport) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 40;

  // Header Banner
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, pageWidth, 75, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('AI MOCK INTERVIEW COACH - PERFORMANCE REPORT', 40, 36);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Candidate: ${report.candidateName} | Target Role: ${report.targetRole} | Date: ${report.completedAt}`, 40, 56);

  y = 100;

  // Hiring Decision & Overall Score Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, y, pageWidth - 80, 70, 6, 6, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Overall Assessment & Recommendation', 55, y + 25);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Overall Score: `, 55, y + 48);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text(`${report.overallScore}/100`, 135, y + 48);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`Hiring Decision: `, 220, y + 48);
  doc.setFont('helvetica', 'bold');
  const decisionColor =
    report.hiringDecision === 'Strong Hire' || report.hiringDecision === 'Hire'
      ? [22, 163, 74]
      : [217, 119, 6];
  doc.setTextColor(decisionColor[0], decisionColor[1], decisionColor[2]);
  doc.text(`${report.hiringDecision}`, 310, y + 48);

  y += 90;

  // Executive Summary
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', 40, y);
  y += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(report.executiveSummary, pageWidth - 80);
  doc.text(summaryLines, 40, y);
  y += summaryLines.length * 14 + 15;

  // Metrics Grid
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Key Communication & Delivery Metrics', 40, y);
  y += 15;

  const metricBoxWidth = (pageWidth - 80 - 20) / 3;
  
  // Metric 1: Grammar Score
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(40, y, metricBoxWidth, 50, 4, 4, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Grammar & Fluency', 50, y + 18);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${report.grammarSummary.overallGrammarScore}/100`, 50, y + 38);

  // Metric 2: Filler Words
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(40 + metricBoxWidth + 10, y, metricBoxWidth, 50, 4, 4, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Filler Words Frequency', 50 + metricBoxWidth + 10, y + 18);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${report.wordUsageSummary.totalFillerWords} (${report.wordUsageSummary.fillerWordsRatio}%)`, 50 + metricBoxWidth + 10, y + 38);

  // Metric 3: Delivery & Confidence
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(40 + (metricBoxWidth + 10) * 2, y, metricBoxWidth, 50, 4, 4, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Confidence Score', 50 + (metricBoxWidth + 10) * 2, y + 18);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${report.deliveryAssessment.overallConfidenceScore}/100`, 50 + (metricBoxWidth + 10) * 2, y + 38);

  y += 70;

  // Strengths & Action Items
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('Top Demonstrated Strengths:', 40, y);
  y += 14;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  report.topSuperpowerStrengths.forEach((s) => {
    const lines = doc.splitTextToSize(`• ${s}`, pageWidth - 80);
    doc.text(lines, 40, y);
    y += lines.length * 12 + 2;
  });

  y += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(194, 65, 12);
  doc.text('Prioritized Action Items to Improve:', 40, y);
  y += 14;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  report.priorityActionItems.forEach((a) => {
    const lines = doc.splitTextToSize(`• ${a}`, pageWidth - 80);
    doc.text(lines, 40, y);
    y += lines.length * 12 + 2;
  });

  y += 15;

  // Questions summary
  if (y > 650) {
    doc.addPage();
    y = 40;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Detailed Spoken Questions Breakdown', 40, y);
  y += 18;

  report.questionEvaluations.forEach((q, idx) => {
    if (y > 700) {
      doc.addPage();
      y = 40;
    }

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(40, y, pageWidth - 80, 20, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Q${idx + 1}: ${q.category} (Score: ${q.contentScore}/100)`, 45, y + 14);
    y += 26;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const qLines = doc.splitTextToSize(`Prompt: "${q.questionText}"`, pageWidth - 80);
    doc.text(qLines, 45, y);
    y += qLines.length * 12 + 4;

    const tLines = doc.splitTextToSize(`Your Response: "${q.transcript.slice(0, 220)}${q.transcript.length > 220 ? '...' : ''}"`, pageWidth - 80);
    doc.setTextColor(51, 65, 85);
    doc.text(tLines, 45, y);
    y += tLines.length * 12 + 4;

    const fbLines = doc.splitTextToSize(`Feedback: ${q.interviewerFeedback}`, pageWidth - 80);
    doc.setTextColor(37, 99, 235);
    doc.text(fbLines, 45, y);
    y += fbLines.length * 12 + 14;
  });

  // Save PDF
  doc.save(`${report.candidateName.replace(/\s+/g, '_')}_Interview_Report.pdf`);
}

export function exportPracticeReportPDF(report: PracticeTestReport) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 40;

  // Header Banner
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, pageWidth, 75, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PRACTICE ASSESSMENT TEST REPORT', 40, 36);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Candidate: ${report.candidateName} | Role: ${report.targetRole} | Score: ${report.totalScore}% (${report.earnedPoints}/${report.maxPoints} pts)`, 40, 56);

  y = 100;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Practice Test Summary & Recommendation', 40, y);
  y += 16;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const recLines = doc.splitTextToSize(report.recommendation, pageWidth - 80);
  doc.text(recLines, 40, y);
  y += recLines.length * 14 + 18;

  // Questions breakdown
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Question-by-Question Review', 40, y);
  y += 18;

  report.results.forEach((r, idx) => {
    if (y > 700) {
      doc.addPage();
      y = 40;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(r.isCorrect ? 22 : 220, r.isCorrect ? 163 : 38, r.isCorrect ? 74 : 38);
    doc.text(`Q${idx + 1} (${r.isCorrect ? 'Correct +10' : 'Incorrect 0'} pts): ${r.category}`, 40, y);
    y += 14;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const qLines = doc.splitTextToSize(r.question, pageWidth - 80);
    doc.text(qLines, 40, y);
    y += qLines.length * 12 + 4;

    doc.setTextColor(71, 85, 105);
    doc.text(`Your answer: ${r.userAnswer}`, 40, y);
    y += 14;

    const expLines = doc.splitTextToSize(`Explanation: ${r.modelExplanation}`, pageWidth - 80);
    doc.setTextColor(37, 99, 235);
    doc.text(expLines, 40, y);
    y += expLines.length * 12 + 14;
  });

  doc.save(`${report.candidateName.replace(/\s+/g, '_')}_Practice_Report.pdf`);
}
