import { notFound } from 'next/navigation'
import { reportService } from '@/services/report.service'
import ReportPageClient from '@/components/report/ReportPageClient'

type PageProps = { params: Promise<{ publicId: string }> }

export default async function PublicReportPage({ params }: PageProps) {
  const { publicId } = await params
  const result = await reportService.getPublicReport(publicId)

  if (!result.success) {
    notFound()
  }

  return <ReportPageClient report={result.report} />
}
