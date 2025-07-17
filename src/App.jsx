import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="Octocat.png" className="App-logo" alt="logo" />
        <p>
          GitHub Codespaces <span className="heart">♥️</span> React
        </p>
        <p className="small">
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
import { useState, useMemo, useEffect } from 'react';
import { quizQuestions, type Question } from '@/lib/quiz-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Star, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

type GameState = 'not_started' | 'in_progress' | 'feedback' | 'finished';

const StarFall = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => {
      const style = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 3}s`,
        animationDelay: `${Math.random() * 4}s`,
      };
      return <Star key={i} className="absolute text-yellow-400 animate-star-fall" style={style} />;
    })}
  </div>
);

export default function Quiz() {
  const [gameState, setGameState] = useState<GameState>('not_started');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);

  const currentQuestion = useMemo(() => quizQuestions[currentQuestionIndex], [currentQuestionIndex]);

  const handleStart = () => {
    setGameState('in_progress');
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswerIndex(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (gameState !== 'in_progress') return;

    setSelectedAnswerIndex(answerIndex);
    if (currentQuestion.answers[answerIndex].isCorrect) {
      setScore(prev => prev + 1);
    }
    setGameState('feedback');
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerIndex(null);
      setGameState('in_progress');
    } else {
      setGameState('finished');
    }
  };

  if (gameState === 'not_started') {
    return (
      <Card className="w-full max-w-lg text-center shadow-2xl animate-fade-in bg-card">
        <CardHeader>
          <div className="mx-auto bg-primary/20 p-4 rounded-full mb-4">
            <Heart className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-4xl text-primary-foreground">اختبار عيد ميلاد أميرة</CardTitle>
          <CardDescription className="font-body text-lg pt-2">اختبار خاص، لكِ فقط.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-8 font-body text-base">
            مستعدة لترين كم أعرفك... وكم تعرفينني؟
          </p>
          <Button onClick={handleStart} size="lg" className="font-headline text-xl">
            لنبدأ!
            <Star className="mr-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'finished') {
    const isWinner = score > quizQuestions.length / 2;

    return (
      <div className="relative w-full max-w-lg">
        <StarFall />
        <Card className="w-full text-center shadow-2xl animate-fade-in bg-card">
          <CardHeader>
             <div className="mx-auto bg-accent/20 p-4 rounded-full mb-4">
              <Award className="w-12 h-12 text-accent" />
            </div>
            <CardTitle className="font-headline text-4xl text-primary-foreground">{isWinner ? 'تهانينا يا أميرة!' : 'محاولة جيدة!'}</CardTitle>
            <CardDescription className="font-body text-lg pt-2">لقد أكملتِ الاختبار!</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold font-headline mb-4 animate-celebrate">
              {score} / {quizQuestions.length}
            </p>
            <p className="mb-8 font-body text-base">
              {isWinner
                ? 'لقد أثبتتِ أنكِ تعرفينني جيدًا! أنتِ مدهشة!'
                : 'بغض النظر عن النتيجة، أنتِ دائمًا الفائزة في قلبي. كان هذا للمتعة فقط!'
              }
            </p>
            <Button onClick={handleStart} size="lg" className="font-headline text-xl">
              هل تلعبين مرة أخرى؟
              <Heart className="mr-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl shadow-2xl animate-fade-in bg-card">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
            <CardTitle className="font-headline text-2xl text-primary-foreground leading-tight">
                {currentQuestion.questionText}
            </CardTitle>
            <div className="font-headline text-lg text-primary-foreground/80 whitespace-nowrap">
                {currentQuestionIndex + 1} / {quizQuestions.length}
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.answers.map((answer, index) => {
            const isSelected = selectedAnswerIndex === index;
            const isCorrect = answer.isCorrect;
            const showFeedback = gameState === 'feedback';
            
            return (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={cn(
                  'h-auto py-4 text-base font-body whitespace-normal justify-start text-right transition-all duration-300',
                  showFeedback && isCorrect && 'bg-green-500 hover:bg-green-500 text-white',
                  showFeedback && isSelected && !isCorrect && 'bg-red-500 hover:bg-red-500 text-white',
                  showFeedback && !isSelected && !isCorrect && 'opacity-50',
                  'hover:bg-accent/80 hover:scale-105 transform'
                )}
                variant="outline"
              >
                {answer.answerText}
                {showFeedback && isCorrect && <Heart className="mr-auto w-5 h-5" />}
              </Button>
            )
          })}
        </div>
        {gameState === 'feedback' && (
          <div className="mt-6 text-center animate-fade-in">
            <Button onClick={handleNext} size="lg" className="font-headline text-xl">
              {currentQuestionIndex < quizQuestions.length - 1 ? 'السؤال التالي' : 'عرض النتائج'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}