CREATE TABLE public.lov_layouts (
    ly_key character varying(3) NOT NULL,
    dtls character varying(30) NOT NULL,
    color_cd character varying(30) NOT NULL,
    cr_dt bigint NOT NULL
);

select * from lov_layouts

CREATE TABLE public.users (
    id serial NOT NULL,
    name character varying(30) NOT NULL,
    password character varying(100) NOT NULL,
	email character varying(20) NOT NULL,
	phno bigint not null,
	cr_dt bigint not null default round(extract(epoch from now()))
);

select * from users



