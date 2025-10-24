import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-center mb-8'>{t('title')}</h1>

        <div className='prose prose-lg mx-auto'>
          <p className='text-xl text-muted-foreground text-center mb-12'>{t('subtitle')}</p>

          <div className='grid md:grid-cols-2 gap-8 mt-16'>
            <div className='text-center'>
              <h2 className='text-2xl font-semibold mb-4'>{t('mission.title')}</h2>
              <p className='text-muted-foreground'>{t('mission.description')}</p>
            </div>

            <div className='text-center'>
              <h2 className='text-2xl font-semibold mb-4'>{t('vision.title')}</h2>
              <p className='text-muted-foreground'>{t('vision.description')}</p>
            </div>
          </div>

          <div className='mt-16 text-center'>
            <h2 className='text-3xl font-semibold mb-8'>{t('team.title')}</h2>
            <p className='text-lg text-muted-foreground'>{t('team.description')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
