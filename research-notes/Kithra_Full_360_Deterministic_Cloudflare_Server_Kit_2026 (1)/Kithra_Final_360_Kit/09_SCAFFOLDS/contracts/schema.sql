-- KITHRA D1 STARTER — design review only, do NOT treat as production-ready.
-- Privacy: application-layer envelope encrypt encrypted_value/cipher_text columns.
-- Firebase issuer + provider subject are verified in API; never trust client user IDs.
PRAGMA foreign_keys = ON;
CREATE TABLE users (
 id TEXT PRIMARY KEY, status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','active','restricted','suspended','deletion_pending','deleted')),
 age_confirmation_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
 deleted_at TEXT, token_valid_after TEXT
);
CREATE TABLE external_identities (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), provider TEXT NOT NULL,
 subject TEXT NOT NULL, email_redacted TEXT, verified_at TEXT,
 UNIQUE(provider,subject)
);
CREATE TABLE mode_personas (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
 mode TEXT NOT NULL CHECK(mode IN ('friend','dating','matrimony')),
 public_name TEXT NOT NULL, bio TEXT, region_code TEXT,
 visibility TEXT NOT NULL DEFAULT 'hidden' CHECK(visibility IN ('hidden','discoverable','paused')),
 state TEXT NOT NULL DEFAULT 'onboarding', created_at TEXT NOT NULL DEFAULT (datetime('now')),
 UNIQUE(user_id,mode)
);
CREATE TABLE consents (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), mode TEXT,
 purpose TEXT NOT NULL, notice_version TEXT NOT NULL, granted INTEGER NOT NULL CHECK(granted IN (0,1)),
 occurred_at TEXT NOT NULL DEFAULT (datetime('now')), source TEXT NOT NULL DEFAULT 'user'
);
CREATE TABLE question_themes (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, description TEXT);
CREATE TABLE question_banks (
 id TEXT PRIMARY KEY, theme_id TEXT NOT NULL REFERENCES question_themes(id), version TEXT NOT NULL,
 locale TEXT NOT NULL DEFAULT 'en-IN', status TEXT NOT NULL DEFAULT 'draft',
 approved_at TEXT, publisher_id TEXT, UNIQUE(theme_id,version,locale)
);
CREATE TABLE questions (
 id TEXT PRIMARY KEY, bank_id TEXT NOT NULL REFERENCES question_banks(id), item_number INTEGER NOT NULL,
 body_placeholder TEXT NOT NULL, response_schema_json TEXT, sensitivity TEXT NOT NULL DEFAULT 'ordinary',
 status TEXT NOT NULL DEFAULT 'placeholder', UNIQUE(bank_id,item_number)
);
CREATE TABLE quiz_attempts (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
 bank_id TEXT NOT NULL REFERENCES question_banks(id),
 assignment_seed_ref TEXT NOT NULL, consent_id TEXT NOT NULL REFERENCES consents(id),
 state TEXT NOT NULL DEFAULT 'assigned', started_at TEXT NOT NULL DEFAULT (datetime('now')),
 submitted_at TEXT, scoring_version TEXT
);
CREATE TABLE quiz_assignments (
 attempt_id TEXT NOT NULL REFERENCES quiz_attempts(id), question_id TEXT NOT NULL REFERENCES questions(id),
 position INTEGER NOT NULL, PRIMARY KEY(attempt_id,question_id), UNIQUE(attempt_id,position)
);
CREATE TABLE quiz_answers (
 id TEXT PRIMARY KEY, attempt_id TEXT NOT NULL REFERENCES quiz_attempts(id),
 question_id TEXT NOT NULL REFERENCES questions(id), encrypted_value TEXT NOT NULL,
 updated_at TEXT NOT NULL DEFAULT (datetime('now')),
 UNIQUE(attempt_id,question_id)
);
CREATE TABLE trait_snapshots (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), mode TEXT NOT NULL,
 model_version TEXT NOT NULL, coverage REAL NOT NULL CHECK(coverage>=0 AND coverage<=1),
 encrypted_vector TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), invalidated_at TEXT
);
CREATE TABLE match_snapshots (
 id TEXT PRIMARY KEY, source_persona_id TEXT NOT NULL REFERENCES mode_personas(id),
 target_persona_id TEXT NOT NULL REFERENCES mode_personas(id), mode TEXT NOT NULL,
 lens TEXT NOT NULL CHECK(lens IN ('mirror','counterpoint','mosaic','resonance')),
 score_band INTEGER NOT NULL CHECK(score_band>=0 AND score_band<=100),
 coverage REAL NOT NULL, model_version TEXT NOT NULL, expires_at TEXT NOT NULL,
 UNIQUE(source_persona_id,target_persona_id,mode,lens,model_version)
);
CREATE TABLE introductions (
 id TEXT PRIMARY KEY, sender_persona_id TEXT NOT NULL REFERENCES mode_personas(id),
 receiver_persona_id TEXT NOT NULL REFERENCES mode_personas(id), mode TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'requested', created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE conversations (
 id TEXT PRIMARY KEY, mode TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'active',
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE conversation_members (
 conversation_id TEXT NOT NULL REFERENCES conversations(id), user_id TEXT NOT NULL REFERENCES users(id),
 joined_at TEXT NOT NULL DEFAULT (datetime('now')), PRIMARY KEY(conversation_id,user_id)
);
CREATE TABLE messages (
 id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL REFERENCES conversations(id), sender_user_id TEXT NOT NULL REFERENCES users(id),
 body_cipher TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')),
 state TEXT NOT NULL DEFAULT 'persisted'
);
CREATE TABLE blocks (
 blocker_user_id TEXT NOT NULL REFERENCES users(id), blocked_user_id TEXT NOT NULL REFERENCES users(id),
 mode_scope TEXT NOT NULL DEFAULT 'all', created_at TEXT NOT NULL DEFAULT (datetime('now')),
 PRIMARY KEY(blocker_user_id,blocked_user_id,mode_scope)
);
CREATE TABLE circles (
 id TEXT PRIMARY KEY, creator_user_id TEXT NOT NULL REFERENCES users(id),
 mode_scope TEXT NOT NULL, name TEXT NOT NULL, rules_version TEXT NOT NULL,
 visibility TEXT NOT NULL DEFAULT 'private', state TEXT NOT NULL DEFAULT 'review'
);
CREATE TABLE circle_members (
 circle_id TEXT NOT NULL REFERENCES circles(id), user_id TEXT NOT NULL REFERENCES users(id),
 role TEXT NOT NULL DEFAULT 'member', state TEXT NOT NULL DEFAULT 'active',
 PRIMARY KEY(circle_id,user_id)
);
CREATE TABLE reports (
 id TEXT PRIMARY KEY, reporter_user_id TEXT NOT NULL REFERENCES users(id),
 target_type TEXT NOT NULL, target_ref TEXT NOT NULL, category TEXT NOT NULL,
 severity TEXT NOT NULL DEFAULT 'untriaged', created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE moderation_cases (
 id TEXT PRIMARY KEY, report_id TEXT NOT NULL REFERENCES reports(id),
 state TEXT NOT NULL DEFAULT 'open', priority INTEGER NOT NULL DEFAULT 3,
 assignee_user_id TEXT, due_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE case_actions (
 id TEXT PRIMARY KEY, case_id TEXT NOT NULL REFERENCES moderation_cases(id),
 actor_user_id TEXT NOT NULL REFERENCES users(id), action TEXT NOT NULL,
 reason_redacted TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE admin_roles (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE);
CREATE TABLE admin_permissions (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE);
CREATE TABLE admin_role_permissions (role_id TEXT NOT NULL REFERENCES admin_roles(id),
 permission_id TEXT NOT NULL REFERENCES admin_permissions(id), PRIMARY KEY(role_id,permission_id));
CREATE TABLE admin_memberships (
 user_id TEXT NOT NULL REFERENCES users(id), role_id TEXT NOT NULL REFERENCES admin_roles(id),
 state TEXT NOT NULL DEFAULT 'invited', created_at TEXT NOT NULL DEFAULT (datetime('now')),
 PRIMARY KEY(user_id,role_id)
);
CREATE TABLE audit_events (
 id TEXT PRIMARY KEY, actor_user_id TEXT, action TEXT NOT NULL, subject_ref TEXT,
 metadata_redacted TEXT, previous_hash TEXT, hash TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE plan_catalog (
 id TEXT PRIMARY KEY, code TEXT NOT NULL, version INTEGER NOT NULL,
 price_minor INTEGER NOT NULL, currency TEXT NOT NULL DEFAULT 'INR', duration_months INTEGER NOT NULL,
 state TEXT NOT NULL DEFAULT 'draft', UNIQUE(code,version,duration_months)
);
CREATE TABLE subscriptions (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), plan_id TEXT NOT NULL REFERENCES plan_catalog(id),
 gateway_subscription_id TEXT UNIQUE, status TEXT NOT NULL, period_end TEXT
);
CREATE TABLE payment_events (
 id TEXT PRIMARY KEY, provider_event_id TEXT NOT NULL UNIQUE, gateway_payment_id TEXT,
 user_id TEXT REFERENCES users(id), amount_minor INTEGER, event_type TEXT NOT NULL,
 signature_verified_at TEXT NOT NULL, processed_at TEXT
);
CREATE TABLE rights_requests (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), request_type TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'submitted', due_at TEXT, completed_at TEXT
);
CREATE INDEX idx_personas_discovery ON mode_personas(mode,visibility,region_code);
CREATE INDEX idx_consents_user_purpose ON consents(user_id,purpose,occurred_at);
CREATE INDEX idx_quiz_answers_attempt ON quiz_answers(attempt_id);
CREATE INDEX idx_match_source_band ON match_snapshots(source_persona_id,mode,lens,score_band);
CREATE INDEX idx_intro_receiver_state ON introductions(receiver_persona_id,state);
CREATE INDEX idx_messages_conv_time ON messages(conversation_id,created_at);
CREATE INDEX idx_cases_state_due ON moderation_cases(state,due_at);
CREATE INDEX idx_audit_subject_time ON audit_events(subject_ref,created_at);
CREATE INDEX idx_rights_user_state ON rights_requests(user_id,state);
