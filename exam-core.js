(function (root) {
  'use strict';
  const SUBJECTS = {
    law: { count: 80, points: 1.25 },
    construction: { count: 80, points: 1.25 },
    environment: { count: 40, points: 1.5 },
    structure: { count: 40, points: 1.5 }
  };

  function plan(subject, extraSubject = 'structure') {
    if (subject === 'all') {
      return {
        law: 25,
        construction: 25,
        environment: extraSubject === 'environment' ? 13 : 12,
        structure: extraSubject === 'environment' ? 12 : 13
      };
    }
    if (!SUBJECTS[subject]) throw new Error('請選擇有效的科目');
    return { [subject]: SUBJECTS[subject].count };
  }

  function describe(subject, extraSubject) {
    const counts = plan(subject, extraSubject);
    return {
      counts,
      count: Object.values(counts).reduce((sum, count) => sum + count, 0),
      total: Object.entries(counts).reduce((sum, [key, count]) => sum + count * SUBJECTS[key].points, 0)
    };
  }

  function shuffle(items, random = Math.random) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function select(questions, year, subject, extraSubject, random = Math.random) {
    const counts = plan(subject, extraSubject);
    const paper = [];
    for (const [key, count] of Object.entries(counts)) {
      const pool = questions.filter(q => q.subject === key && (year === 'all' || String(q.year) === String(year)));
      if (pool.length < count) throw new Error('這個年度的題目不足，請重新選擇年度');
      paper.push(...shuffle(pool, random).slice(0, count));
    }
    return shuffle(paper, random);
  }

  function score(questions, answers) {
    return questions.reduce((result, question) => {
      result.total += question.points;
      if (answers[question.id] && answers[question.id] === question.answer) {
        result.correct++;
        result.points += question.points;
      }
      return result;
    }, { total: 0, correct: 0, points: 0 });
  }

  const api = { plan, describe, select, score };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ExamCore = api;
})(globalThis);
