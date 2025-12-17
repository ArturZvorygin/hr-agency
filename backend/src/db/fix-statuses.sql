-- Обновление статусов заявок с lowercase на uppercase
UPDATE requests SET status = 'NEW' WHERE status = 'new';
UPDATE requests SET status = 'DRAFT' WHERE status = 'draft';
UPDATE requests SET status = 'IN_PROGRESS' WHERE status = 'in_progress';
UPDATE requests SET status = 'SOURCING' WHERE status = 'sourcing';
UPDATE requests SET status = 'INTERVIEWS' WHERE status = 'interviews';
UPDATE requests SET status = 'CLOSED' WHERE status = 'closed' OR status = 'done';
UPDATE requests SET status = 'CANCELLED' WHERE status = 'cancelled';

-- Обновление статуса wait_client на SOURCING (как наиболее подходящий)
UPDATE requests SET status = 'SOURCING' WHERE status = 'wait_client';

-- Изменение default значения
ALTER TABLE requests ALTER COLUMN status SET DEFAULT 'NEW';
