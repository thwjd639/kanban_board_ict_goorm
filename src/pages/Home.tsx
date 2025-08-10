import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const quickActions = [
    {
      icon: '📋',
      title: '칸반 보드',
      description: '드래그 앤 드롭으로 작업을 시각적으로 관리하세요',
      linkTo: '/kanban',
      buttonText: '시작하기',
      buttonColor: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: '📊',
      title: '대시보드',
      description: '프로젝트 진행 상황을 한눈에 파악하세요',
      linkTo: '/dashboard',
      buttonText: '보러가기',
      buttonColor: 'bg-green-500 hover:bg-green-600'
    }
  ];

  const features = [
    {
      title: '드래그 앤 드롭',
      description: '직관적인 작업 이동으로 쉽게 상태를 변경할 수 있습니다.',
      icon: '🎯'
    },
    {
      title: '실시간 데이터 연동',
      description: '칸반보드와 대시보드가 실시간으로 동기화됩니다.',
      icon: '⚡'
    },
    {
      title: '우선순위 관리',
      description: '작업의 중요도에 따라 우선순위를 설정하고 관리합니다.',
      icon: '⭐'
    },
    {
      title: '다크모드 지원',
      description: '사용자 취향에 맞는 테마를 선택할 수 있습니다.',
      icon: '🌙'
    },
    {
      title: '작업 모드 구분',
      description: '개인용과 업무용 작업을 구분하여 관리할 수 있습니다.',
      icon: '👔'
    },
    {
      title: '반응형 디자인',
      description: '모든 디바이스에서 최적화된 사용자 경험을 제공합니다.',
      icon: '📱'
    }
  ];

  const techStack = [
    { name: 'React', version: '18.x', description: 'UI 라이브러리' },
    { name: 'TypeScript', version: '5.x', description: '타입 안전성' },
    { name: 'Tailwind CSS', version: '3.x', description: '스타일링 & 다크모드' },
    { name: 'React Router', version: '6.x', description: '라우팅' }
  ];

  const usageSteps = [
    {
      number: 1,
      title: '작업 생성',
      description: '각 컬럼의 "작업 추가" 버튼을 클릭하여 새로운 작업을 생성합니다.'
    },
    {
      number: 2,
      title: '작업 이동',
      description: '작업 카드를 드래그하여 다른 컬럼으로 이동시킵니다.'
    },
    {
      number: 3,
      title: '모드 전환',
      description: '우상단의 버튼으로 개인용/업무용 모드를 전환할 수 있습니다.'
    },
    {
      number: 4,
      title: '진행 상황 확인',
      description: '대시보드에서 전체 프로젝트의 진행 상황을 실시간으로 모니터링합니다.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
        
        {/* 히어로 섹션 */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 transition-colors leading-tight">
            프로젝트 관리 시스템에 
            <br className="hidden sm:block" />
            오신 것을 환영합니다
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 transition-colors max-w-3xl mx-auto leading-relaxed">
            효율적인 작업 관리를 위한 현대적인 칸반 보드 시스템
          </p>
          
          {/* 빠른 액세스 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.linkTo}
                className={`w-full sm:w-auto ${action.buttonColor} text-white px-6 py-3 rounded-lg transition-colors font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200`}
              >
                {action.icon} {action.buttonText}
              </Link>
            ))}
          </div>
        </div>

        {/* 프로젝트 개요 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-200 dark:border-gray-700 mb-12 sm:mb-16 transition-colors">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 transition-colors text-center">
            프로젝트 개요
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 text-center max-w-4xl mx-auto text-base sm:text-lg">
            이 프로젝트는 팀의 작업 흐름을 시각화하고 관리하기 위한 칸반 보드 애플리케이션입니다.
            직관적인 드래그 앤 드롭 인터페이스를 통해 작업을 쉽게 이동하고, 실시간으로 프로젝트 상태를 파악할 수 있습니다.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center max-w-4xl mx-auto text-base sm:text-lg">
            React와 TypeScript를 기반으로 구축되었으며, 현대적인 웹 기술을 활용하여 빠르고 반응성이 뛰어난 사용자 경험을 제공합니다.
          </p>
        </div>

        {/* 주요 기능 */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 sm:mb-12 transition-colors text-center">
            주요 기능
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="text-3xl sm:text-4xl mb-4 text-center">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center text-lg">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 기술 스택 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-200 dark:border-gray-700 mb-12 sm:mb-16 transition-colors">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 transition-colors text-center">
            기술 스택
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {techStack.map((tech, index) => (
              <div key={index} className="flex flex-col items-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">{tech.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">{tech.description}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  v{tech.version}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 사용 방법 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-200 dark:border-gray-700 mb-12 sm:mb-16 transition-colors">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 transition-colors text-center">
            사용 방법
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {usageSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 CTA */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg">
            지금 바로 시작해서 더 효율적인 프로젝트 관리를 경험해보세요!
          </p>
          <Link
            to="/kanban"
            className="inline-block bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105"
          >
            🚀 지금 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;