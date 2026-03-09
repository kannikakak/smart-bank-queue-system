create table users (
    id bigserial primary key,
    full_name varchar(120) not null,
    email varchar(150) not null unique,
    phone varchar(30),
    password_hash text not null,
    role varchar(20) not null,
    is_active boolean not null default true,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);

create table branches (
    id bigserial primary key,
    name varchar(150) not null,
    address text not null,
    phone varchar(30),
    open_time time not null,
    close_time time not null,
    latitude numeric(10, 7),
    longitude numeric(10, 7),
    is_active boolean not null default true,
    created_at timestamp not null default current_timestamp
);

create table services (
    id bigserial primary key,
    name varchar(150) not null unique,
    duration_minutes integer not null,
    is_active boolean not null default true,
    created_at timestamp not null default current_timestamp
);

create table staff_branch (
    id bigserial primary key,
    staff_id bigint not null references users(id) on delete cascade,
    branch_id bigint not null references branches(id) on delete cascade,
    is_active boolean not null default true,
    constraint uk_staff_branch unique (staff_id, branch_id)
);

create table branch_services (
    id bigserial primary key,
    branch_id bigint not null references branches(id) on delete cascade,
    service_id bigint not null references services(id) on delete cascade,
    is_active boolean not null default true,
    constraint uk_branch_service unique (branch_id, service_id)
);

create table appointments (
    id bigserial primary key,
    customer_id bigint not null references users(id),
    branch_id bigint not null references branches(id),
    service_id bigint not null references services(id),
    staff_id bigint references users(id),
    start_time timestamp not null,
    end_time timestamp not null,
    status varchar(20) not null,
    checked_in_at timestamp,
    service_start_at timestamp,
    service_end_at timestamp,
    created_at timestamp not null default current_timestamp
);

create table queue_events (
    id bigserial primary key,
    appointment_id bigint not null references appointments(id) on delete cascade,
    action varchar(30) not null,
    from_status varchar(20),
    to_status varchar(20),
    performed_by bigint references users(id),
    event_time timestamp not null default current_timestamp,
    note text
);

create table notifications (
    id bigserial primary key,
    appointment_id bigint not null references appointments(id) on delete cascade,
    channel varchar(20) not null,
    type varchar(30) not null,
    recipient varchar(150) not null,
    status varchar(20) not null,
    scheduled_at timestamp,
    sent_at timestamp,
    created_at timestamp not null default current_timestamp
);

create index idx_users_email on users (email);
create index idx_staff_branch_branch on staff_branch (branch_id);
create index idx_staff_branch_staff on staff_branch (staff_id);
create index idx_branch_services_branch on branch_services (branch_id);
create index idx_branch_services_service on branch_services (service_id);
create index idx_appointments_customer_start on appointments (customer_id, start_time);
create index idx_appointments_branch_start on appointments (branch_id, start_time);
create index idx_appointments_staff on appointments (staff_id);
create index idx_queue_events_appointment on queue_events (appointment_id);
create index idx_notifications_appointment on notifications (appointment_id);
