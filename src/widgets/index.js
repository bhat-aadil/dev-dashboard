import PomodoroWidget from "../components/PomodoroWidget";
import GitHubTrendingWidget from "../components/GitHubTrendingWidget";
import DailyCodingChallenge from "../components/CodingChallengeWidget";
import InterviewPrepWidget from "../components/InterviewPrepWidget";
import WorldClockWidget from "../components/WorldClockWidget";
import StocksWidget from "../components/StocksWidget";
import CryptoWidget from "../components/CryptoWidget";
import QuotesWidget from "../components/QuoteWidget";
import TasksWidget from "../components/TasksWidget";
import StackOverflowWidget from "../components/StackOverflowWidget";
import NewsWidget from "../components/NewsWidget";

export const availableWidgets = {
  CodingChallenge: DailyCodingChallenge,
  Crypto: CryptoWidget,
  GitHub: GitHubTrendingWidget,
  Interview: InterviewPrepWidget,
  News: NewsWidget,
  Pomodoro: PomodoroWidget,
  Quotes: QuotesWidget,
  "Stack Overflow": StackOverflowWidget,
  Stocks: StocksWidget,
  Tasks: TasksWidget,
  "World Clock": WorldClockWidget,
};
