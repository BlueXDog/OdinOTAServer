INSERT INTO public.xphone_devs(name, email, key, create_time, last_login_time)
VALUES ('test', 'test@ginno.com', 'xphone', '1999-01-08 04:05:06', '1999-01-08 04:05:06');

INSERT INTO public.xphone_versions(type, version, url, release_time, release_dev_id)
VALUES ('OS', '1.0.1', 'https://d19sohnjnsw0y4.cloudfront.net/OS/1.0.1', '1999-01-08 04:05:06', 1),
       ('SBL', '1.0.1', 'https://d19sohnjnsw0y4.cloudfront.net/SBL/1.0.1', '1999-01-08 04:05:06', 1),
       ('STM', '1.0.1', 'https://d19sohnjnsw0y4.cloudfront.net/STM/1.0.1', '1999-01-08 04:05:06', 1),
       ('DATA', '1.0.1', 'https://d19sohnjnsw0y4.cloudfront.net/DATA/1.0.1', '1999-01-08 04:05:06', 1),
       ('TEXT', '1.0.1', 'https://d19sohnjnsw0y4.cloudfront.net/TEXT/1.0.1', '1999-01-08 04:05:06', 1),
       ('OS', '1.0.2', 'https://d19sohnjnsw0y4.cloudfront.net/OS/1.0.2', '1999-01-08 04:05:06', 1),
       ('SBL', '1.0.2', 'https://d19sohnjnsw0y4.cloudfront.net/SBL/1.0.2', '1999-01-08 04:05:06', 1),
       ('STM', '1.0.2', 'https://d19sohnjnsw0y4.cloudfront.net/STM/1.0.2', '1999-01-08 04:05:06', 1),
       ('DATA', '1.0.2', 'https://d19sohnjnsw0y4.cloudfront.net/DATA/1.0.2', '1999-01-08 04:05:06', 1),
       ('TEXT', '1.0.2', 'https://d19sohnjnsw0y4.cloudfront.net/TEXT/1.0.2', '1999-01-08 04:05:06', 1),
       ('SBL', '2.1.218', 'XPhone/SBL/2.1.218', '2020-04-21 06:50:36.114', 1),
       ('TEXT', '2.1.0', 'XPhone/TEXT/2.1.0', '2020-04-21 06:53:04.528', 1),
       ('DATA', '2.1.0', 'XPhone/DATA/2.1.0', '2020-04-21 07:33:39.636', 1),
       ('OS', '20.1.218', 'XPhone/OS/20.1.218', '2020-04-22 02:49:48.2591', 1),
       ('OS', '2.1.218', 'XPhone/OS/2.1.218', '2020-04-22 08:12:52.094', 1),
       ('OS', '2.1.0', 'XPhone/OS/vn/2.1.0', '2020-04-22 10:36:37.079', 1),
       ('SBL', '2.1.0', 'XPhone/SBL/vn/2.1.0', '2020-04-22 10:36:36.143', 1),
       ('STM', '2.0.0', 'XPhone/STM/vn/2.0.0', '2020-04-22 10:36:35.768', 1),
       ('DATA', '1.0.0', 'XPhone/DATA/vn/1.0.0', '2020-04-22 10:35:54.168', 1),
       ('TEXT', '1.0.0', 'XPhone/TEXT/vn/1.0.0', '2020-04-22 10:36:35.925', 1);

INSERT INTO public.xphone_regions(name, description)
VALUES ('vn', 'Viet Nam'),
       ('cn', 'China');

INSERT INTO public.xphone_productions(name, region_id, hw_version, firmware_key, os_version_id, sbl_version_id, stm_version_id, data_version_id, text_version_id, os_history, sbl_history, stm_history, data_history, text_history)
VALUES ('XPhone', 1, '1.0', 'firmware_key_vn', 16, 17, 18, 19, 20, '{"2.1.0","1.0.1"}', '{"2.1.0","1.0.1"}', '{"2.0.0","1.0.1"}', '{"1.0.0","1.0.1"}', '{"1.0.0","1.0.1"}'),
       ('XPhone', 2, '1.0', 'firmware_key_cn', 6, 7, 8, 9, 10, '{"1.0.2"}', '{"1.0.2"}', '{"1.0.2"}', '{"1.0.2"}', '{"1.0.2"}' );

INSERT INTO public.xphone_devices(imei, user_key, production_id, hw_version, update_permission, os_version, sbl_version, stm_version, data_version, text_version, init_time)
VALUES ('014869004732113', 'xphone', 1, '1.0', 1, '1.0', '1.0', '1.0', '1.0', '1.0', '1999-01-08 04:05:06');
