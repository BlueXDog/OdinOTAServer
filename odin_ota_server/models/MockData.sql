INSERT INTO public.odin_devs(name, email, key, create_time, last_login_time)
VALUES ('test', 'test@ginno.com', 'odin', '1999-01-08 04:05:06', '1999-01-08 04:05:06');


INSERT INTO public.odin_regions(name, description)
VALUES ('vn', 'Viet Nam'),
       ('cn', 'China');

INSERT INTO public.odin_productions(name, region_id, hw_version, firmware_key, os_latest_version, os_history)
VALUES ('odin', 1, '1.0', 'firmware_key_vn', '2.1.0', '{1.2.0,2.1.0}'),
       ('odin', 2, '1.0', 'firmware_key_cn', '2.2.0','{1.0.2,1.1.2,2.0.1}');

INSERT INTO public.odin_devices(imei, user_key, production_id, hw_version, update_permission, os_version,init_time)
VALUES ('014869004732113', 'odin', 1, '1.0', 1, '1.0', '1999-01-08 04:05:06');

INSERT INTO public.odin_versions(production_id,type, version, url, release_time, release_dev_id)
VALUES (1,'OS', '1.2.0', 'https://cdnotastaging.xor.support/odin/OS/1.2.0/OS_123456.zip', '1999-01-08 04:05:06', 1),
       (2,'OS', '1.0.2', 'https://d19sohnjnsw0y4.cloudfront.net/OS/1.0.2', '1999-01-08 04:05:06', 1),
       (2,'OS', '1.1.2', 'odin/OS/20.1.218', '2020-04-22 02:49:48.2591', 1),
       (2,'OS', '2.0.1', 'odin/OS/2.1.218', '2020-04-22 08:12:52.094', 1),
       (1,'OS', '2.1.0', 'https://cdnotastaging.xor.support/odin/OS/2.1.0/OS_234567.zip', '2020-04-22 10:36:37.079', 1);
       

