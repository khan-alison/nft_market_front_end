import { Collapse, Typography } from 'antd';
import { useTranslation } from 'next-i18next';

import ExpandIcon from 'public/svg/expand_icon.svg';
import CollapseIcon from 'public/svg/collapse_icon.svg';

const { Panel } = Collapse;
const { Title, Paragraph } = Typography;

type QuestionProp = {
  listQuestion: {
    question: string;
    answer: string;
  }[];
};


const Question = () => {
  const { t } = useTranslation();

  const listQuestion = [
    {
      question: 'question.question1',
      answer: t('question.answer1'),
    },
    {
      question: 'question.question2',
      answer: t('question.answer2'),
    },
    {
      question: 'question.question3',
      answer: t('question.answer3', {
        link: 'https://staking.nftify.network/#/',
      }),
    },
    {
      question: 'question.question4',
      answer: t('question.answer4', {
        link: 'https://staking.nftify.network/#/',
      }),
    },
    {
      question: 'question.question5',
      answer: t('question.answer5', {
        link: 'https://staking.nftify.network/#/',
      }),
    },
  ];
  return (
    <section className="question-n1" id="question-n1">
      <Collapse
        defaultActiveKey={['1']}
        ghost
        className="question-n1__item"
        expandIcon={({ isActive }) => {
          return isActive ? (
            <img src={CollapseIcon} className="question-n1__icon" />
          ) : (
            <img src={ExpandIcon} className="question-n1__icon" />
          );
        }}
      >
        {listQuestion.map(({ question, answer }, index) => (
          <Panel header={t(question)} key={index + 1}>
            <div
              dangerouslySetInnerHTML={{
                __html: answer,
              }}
            />
          </Panel>
        ))}
      </Collapse>
    </section>
  );
};

export default Question;
