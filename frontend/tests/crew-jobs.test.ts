import assert from 'node:assert/strict';
import test from 'node:test';
import { crewJobs, getCrewJob } from '../src/data/crew-jobs';

test('catálogo possui os cinco grupos da formação', () => {
  const groups = new Set(Object.values(crewJobs).map((job) => job.formationRole));
  ['Capitão', 'Navegador', 'Combatente', 'Suporte', 'Especialista'].forEach((group) =>
    assert.ok(groups.has(group as never)),
  );
});

test('recupera cargo por identificador', () => {
  assert.equal(getCrewJob('navigator')?.name, 'Navegador');
});
