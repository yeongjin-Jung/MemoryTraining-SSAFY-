import React, { useReducer, useState, useEffect, useRef } from 'react';
import Progress from './Progress';
import Question from './Question';
import Answers from './Answers';

import { SET_ANSWERS, SET_CURRENT_QUESTION, SET_CURRENT_ANSWER, SET_ERROR, SET_SHOW_RESULTS, RESET_QUIZ, TOGGLE_BOOKMARK_FLAG, SET_BOOKMARKED_QUIZ, SET_ALL_TO_UNBOOKMARKED } from './types';
import quizReducer from './QuizReducer';
import QuizContext from './QuizContext';
import { AwesomeButton } from 'react-awesome-button';
import '../../assets/css/back-btn-styles.css';
import './QuizPage.css';
import { BsBookmark } from 'react-icons/bs';
import { FcBookmark } from 'react-icons/fc';

import axios from 'axios';
import SERVER from '../../api/server';

const CardTestPage = (props) => {
  let quizs = props.history.location.state.quizList;
  // //수정 console.log('props.history.location.state : ', props.history.location.state);
  // const [btnFlag, setBtnFlag] = useState(true);
  let btnFlag = useRef(false);
  useRef;
  useEffect(() => {
    dispatch({ type: 'RESET_QUIZ' });
    // //수정 console.log('quizs =>', quizs);
    // //수정 console.log('book=>', book);

    //수정 console.log('QuizTestPage.jsx useEffect called.');
  }, []);

  // const [noBookmarkedCards, setNoBookmarkedCards] = useState(false);

  const initialState = {
    quizs,
    currentQuestion: 0,
    currentAnswer: '',
    correctAnswer: [],
    answers: [],
    showResults: false,
    error: '',
  };

  const [state, dispatch] = useReducer(quizReducer, initialState);
  const { currentQuestion, currentAnswer, answers, showResults, error, wrongAnswersIdx } = state;

  const checkIfNoBookmarkCards = () => {
    const found = state.quizs.find((quiz) => quiz.card.bookmark_flag == 1);
    //수정 console.log('found : ', found);

    // 북마크 된 카드들이 하나도 없을 때
    if (found == undefined) {
      // setNoBookmarkedCards(true);
      //수정 console.log('NO BOOKMARKED CARDS');
      btnFlag = false;
    }

    // 북마크 된 카드들이 하나라도 있을 때
    else {
      // setNoBookmarkedCards(false);
      // setBtnFlag(true);
      //수정 console.log('YES BOOKMARKED CARDS');
      btnFlag = true;
    }
  };

  const question = state.quizs[currentQuestion];

  const handleWrongAnswerToBookmark = () => {
    answers.map((answer) => {
      //수정 console.log('answer : ', answer);
    });

    dispatch({ type: 'SET_ALL_WRONG_ANSWERS_TO_BOOKMARKED', book: props.history.location.state.book });
  };

  const handleAllToUnbookmarked = () => {
    dispatch({ type: 'SET_ALL_TO_UNBOOKMARKED', book: props.history.location.state.book });
  };

  const renderError = () => {
    if (!error) {
      return;
    }
    return <div className="error">{error}</div>;
  };

  const renderResultMark = (question, answer) => {
    //수정 console.log('question 입니다 :', question);
    //수정 console.log('answer 입니다 : ', answer);

    if (question.answer === answer.answer) {
      return (
        <>
          <span className="correct">정답</span>
        </>
      );
    } else {
      // dispatch({ type: SET_WRONG_ANSWER, idx: currentQuestion });
      return <span className="failed">오답</span>;
    }
  };

  const renderResultData = () => {
    return state.answers.map((answer) => {
      const question = state.quizs.find((question) => question.no === answer.questionId);
      return (
        <div className="result-content" key={question.no}>
          <div className="result-content-question">
            <p className="meaning-type">뜻</p>
            <p className="meaning-type-text">{question.question}</p>
          </div>
          <div className="result-content-question">
            <p className="meaning-type">단어</p>
            <p className="meaning-type-text">{answer.card.word}</p>
          </div>
          <div className="result-content-result">{renderResultMark(question, answer)}</div>
          <button>
            {/* 북마크 활성화 */}
            {question.card.bookmark_flag == 0 && (
              <BsBookmark
                onClick={() => {
                  //수정 console.log('BOOKMARK BUTTON CLICKED.');

                  axios.post(SERVER.BASE_URL + SERVER.ROUTES.bookmark, { book_id: props.history.location.state.book.id, card_id: question.card.id }).then((res) => {
                    //수정 console.log('BOOKMARK ACTIVATED.');
                    //수정 console.log(res);

                    dispatch({ type: TOGGLE_BOOKMARK_FLAG, quizIdx: question.no - 1 });
                  });
                }}
              />
            )}

            {/* 북마크 해제 */}
            {question.card.bookmark_flag == 1 && (
              <FcBookmark
                onClick={() => {
                  //수정 console.log('BOOKMARK DEACTIVATED.');

                  axios.delete(SERVER.BASE_URL + SERVER.ROUTES.unbookmark, { data: { book_id: props.history.location.state.book.id, card_id: question.card.id } }).then((res) => {
                    //수정 console.log(res);

                    dispatch({ type: TOGGLE_BOOKMARK_FLAG, quizIdx: question.no - 1 });
                    checkIfNoBookmarkCards();
                  });
                }}
              />
            )}
          </button>
        </div>
      );
    });
  };

  let newQuizs = [];
  const getBookmarkedQuizList = async () => {
    await axios
      .get(SERVER.BASE_URL + SERVER.ROUTES.getEntireQuizs + props.history.location.state.book.id, {
        params: {
          bookmark: 'True',
        },
      })
      .then((res) => {
        // //수정 console.log('getBookmarkedQuizList quiz: ', res);
        // setBookmarkedQuizList(res.data);
        //수정 console.log('res.data : ', res.data);
        newQuizs = [...res.data];
      });
  };

  const restart = async () => {
    await getBookmarkedQuizList();
    //수정 console.log('new quizs : ', newQuizs);

    dispatch({ type: SET_BOOKMARKED_QUIZ, newQuizs: newQuizs });
  };

  const next = () => {
    //수정 console.log('currentQuestion : ', currentQuestion);
    const answer = {
      card: question.card,
      questionId: question.no,
      realAnswer: question.answer,
      answer: currentAnswer,
      currentQuestion: currentQuestion,
      isCorrect: question.answer == currentAnswer ? true : false,
    };

    if (!currentAnswer) {
      dispatch({ type: SET_ERROR, error: '답안을 선택해 주세요.' });

      return;
    }
    answers.push(answer);
    dispatch({ type: SET_ANSWERS, answers });
    dispatch({ type: SET_CURRENT_ANSWER, currentAnswer: '' });

    if (currentQuestion + 1 < state.quizs.length) {
      dispatch({ type: SET_CURRENT_QUESTION, currentQuestion: currentQuestion + 1 });
      return;
    }

    dispatch({ type: SET_SHOW_RESULTS, showResults: true });
  };

  if (showResults) {
    //수정 console.log('answers : ', answers);
    checkIfNoBookmarkCards();
    // //수정 console.log('wrongAnswersIdx : ', wrongAnswersIdx);

    renderResultData();

    return (
      <div className="CardTest-root">
        <div className="CardTest-background"></div>
        <div className="Quiz-container">
          <div className="container-result">
            <p className="result-title" style={{ textShadow: '2px 2px 2.5px black' }}>
              채점 결과
            </p>
            <div className="container-result-content">
              {/* <div className="align-right"> */}
              <div className="container-fluid button-group" style={{}}>
                <AwesomeButton className="aws-scrapback-btn one" type="bookmark-restart" onPress={handleAllToUnbookmarked}>
                  <span>북마크 전체 해제</span>
                </AwesomeButton>
                {/* <Button onClick={handleWrongAnswerToBookmark}>틀린 문제 모두 스크랩하기</Button> */}
                <AwesomeButton className="aws-scrapback-btn two" type="testfinish" onPress={handleWrongAnswerToBookmark}>
                  <span>틀린 문제 모두 북마크</span>
                </AwesomeButton>
              </div>
              <ul>{renderResultData()}</ul>
              {/* <button className="restart-btn" onClick={restart}>
              다시 시작
            </button> */}
              <div className="result-btn-container">
                {/* <button className="restart-btn" onClick={restart}>
                  북마크 단어들만 다시 테스트
                </button> */}

                {btnFlag && (
                  <AwesomeButton className="aws-bookmark-restart-btn" type="third" onPress={restart}>
                    <span>북마크 단어 다시 테스트</span>
                  </AwesomeButton>
                )}
                {!btnFlag && (
                  <AwesomeButton className="aws-bookmark-restart-btn" type="third" onPress={restart} disabled={true}>
                    <strike>북마크 단어 다시 테스트</strike>
                  </AwesomeButton>
                )}

                {/* <button
                  className="restart-btn"
                  onClick={() => {
                    //수정 console.log('돌아가기 button clicked.');
                    //수정 console.log('props : ', props);
                    props.history.push({ pathname: '/set-detail', state: { book: props.location.state.book } });
                  }}
                >
                  돌아가기
                </button> */}

                <AwesomeButton
                  className="aws-testfinish-btn"
                  type="testfinish"
                  onPress={() => {
                    //수정 console.log('돌아가기 button clicked.');
                    //수정 console.log('props : ', props);
                    props.history.push({ pathname: '/set-detail', state: { book: props.location.state.book } });
                  }}
                >
                  <span>끝내기</span>
                </AwesomeButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {props.history.location.state.quizList.length == 0 && (
          <div className="CardTest-root">
            <div className="CardTest-background"></div>
            <div className="container-fluid " style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
              <AwesomeButton
                // style={{ marginTop: '1rem' }}
                className="aws-Quizback-btn"
                type="primary"
                onPress={() => {
                  props.history.push({ pathname: '/set-detail', state: { book: props.location.state.book } });
                }}
              >
                <span>세트페이지</span>
              </AwesomeButton>

              <div className="search-empty" style={{ marginTop: '35vh' }}>
                북마크 된 카드가 없습니다.
              </div>
            </div>
          </div>
        )}

        {props.history.location.state.quizList.length != 0 && (
          <QuizContext.Provider value={{ state, dispatch }}>
            <div className="CardTest-root">
              <div className="CardTest-background"></div>

              <AwesomeButton
                className="aws-Quizback-btn"
                type="primary"
                onPress={() => {
                  props.history.push({ pathname: '/set-detail', state: { book: props.location.state.book } });
                }}
              >
                <span>세트페이지</span>
              </AwesomeButton>

              <div className="Quiz-container">
                <Progress total={state.quizs.length} current={state.currentQuestion + 1} />
                <div className="Quiz-problem">
                  <Question question={question.question} />
                  {renderError()}
                  {/* <h2>In 2016, who won the Formula 1 World Constructor's Championship for the third time in a row?</h2> */}
                </div>
                <div className="Quiz-answer">
                  <Answers question={question} currentAnswer={currentAnswer} dispatch={dispatch} />
                </div>
                {/* <button className="Quizbtn Quizbtn-primary" onClick={next}>
              <p>다음 문제</p>
            </button> */}

                <AwesomeButton className="aws-nextQuiz-btn" type="nextQuiz" onPress={next}>
                  <span>다음 문제</span>
                </AwesomeButton>
              </div>
            </div>
          </QuizContext.Provider>
        )}
      </>
    );
  }
};

export default CardTestPage;
