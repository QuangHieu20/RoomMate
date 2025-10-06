import * as yup from 'yup';

export const useValidationSchema = () => {
  const { t } = useI18n();

  // Tạo computed schemas để reactive với locale changes
  const registerSchema = computed(() =>
    yup.object({
      email: yup
        .string()
        .required(t('auth.validation.emailRequired'))
        .email(t('auth.validation.emailInvalid')),
      phone: yup
        .string()
        .required(t('auth.validation.phoneRequired'))
        .matches(/^[0-9]+$/, t('auth.validation.phoneInvalid'))
        .min(8, t('auth.validation.phoneMin'))
        .max(15, t('auth.validation.phoneMax')),
      fullName: yup
        .string()
        .required(t('auth.validation.nameRequired'))
        .min(2, t('auth.validation.nameMin'))
        .max(50, t('auth.validation.nameMax'))
        .matches(
          /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƯăâêôư\s]+$/,
          t('auth.validation.nameAlpha')
        )
        .test(
          'no-only-spaces',
          t('auth.validation.nameNoSpaces'),
          function (value) {
            if (!value) return true; // Let required handle empty values
            return value.trim().length > 0;
          }
        ),
      password: yup
        .string()
        .required(t('auth.validation.passwordRequired'))
        .min(6, t('auth.validation.passwordMin'))
        .max(50, t('auth.validation.passwordMax'))
        .test(
          'no-only-spaces',
          t('auth.validation.passwordNoSpaces'),
          function (value) {
            if (!value) return true; // Let required handle empty values
            return value.trim().length > 0;
          }
        ),
    })
  );

  const loginSchema = computed(() =>
    yup.object({
      email: yup
        .string()
        .required(t('auth.validation.emailRequired'))
        .email(t('auth.validation.emailInvalid')),
      password: yup
        .string()
        .required(t('auth.validation.passwordRequired'))
        .min(8, t('auth.validation.passwordMin')),
    })
  );

  // Post form validation schema
  const postFormSchema = computed(() =>
    yup.object({
      // Location fields
      province: yup.string().required(t('post.validation.provinceRequired')),
      district: yup.string().required(t('post.validation.districtRequired')),
      ward: yup.string().required(t('post.validation.wardRequired')),
      address: yup
        .string()
        .required(t('post.validation.addressRequired'))
        .min(10, t('post.validation.addressMin'))
        .max(200, t('post.validation.addressMax')),

      // Room information
      roomType: yup.string().required(t('post.validation.roomTypeRequired')),
      price: yup
        .number()
        .required(t('post.validation.priceRequired'))
        .min(100000, t('post.validation.priceMin'))
        .max(50000000, t('post.validation.priceMax')),
      priceType: yup.string().required(t('post.validation.priceTypeRequired')),
      area: yup
        .number()
        .required(t('post.validation.areaRequired'))
        .min(5, t('post.validation.areaMin'))
        .max(500, t('post.validation.areaMax')),

      // Post content
      title: yup
        .string()
        .required(t('post.validation.titleRequired'))
        .min(10, t('post.validation.titleMin'))
        .max(150, t('post.validation.titleMax')),
      description: yup
        .string()
        .required(t('post.validation.descriptionRequired'))
        .min(20, t('post.validation.descriptionMin'))
        .max(5000, t('post.validation.descriptionMax')),

      // Optional fields - với validation khi có giá trị
      contactName: yup
        .string()
        .required(t('post.validation.contactNameRequired'))
        .transform((value, originalValue) => {
          if (
            originalValue === '' ||
            originalValue === null ||
            originalValue === undefined
          ) {
            return null;
          }
          return value;
        })
        .test(
          'min-length',
          t('post.validation.contactNameMin'),
          function (value) {
            if (value === null || value === undefined || value === '')
              return true;
            return value.length >= 2;
          }
        )
        .test(
          'max-length',
          t('post.validation.contactNameMax'),
          function (value) {
            if (value === null || value === undefined || value === '')
              return true;
            return value.length <= 50;
          }
        ),
      contactPhone: yup
        .string()
        .required(t('post.validation.contactPhoneRequired'))
        .transform((value, originalValue) => {
          if (
            originalValue === '' ||
            originalValue === null ||
            originalValue === undefined
          ) {
            return null;
          }
          return value;
        })
        .test(
          'phone-vietnam',
          t('post.validation.contactPhoneVietnam'),
          function (value) {
            if (value === null || value === undefined || value === '')
              return true;

            // Remove all non-digit characters for validation
            const cleanValue = value.replace(/[^\d]/g, '');

            // Vietnamese mobile prefixes
            const vietnamMobilePrefixes = [
              '032',
              '033',
              '034',
              '035',
              '036',
              '037',
              '038',
              '039', // Viettel
              '070',
              '076',
              '077',
              '078',
              '079', // MobiFone
              '081',
              '082',
              '083',
              '084',
              '085', // Vinaphone
              '086',
              '087',
              '088',
              '089', // Vinaphone (08x)
              '056',
              '058', // Vietnamobile
              '059', // Gmobile
            ];

            // Check different formats
            if (cleanValue.length === 10 && cleanValue.startsWith('0')) {
              // Local format: 0xxxxxxxxx (ví dụ: 0862171222)
              const prefix = cleanValue.substring(0, 3);
              return vietnamMobilePrefixes.includes(prefix);
            } else if (
              cleanValue.length === 11 &&
              cleanValue.startsWith('84')
            ) {
              // International format: 84xxxxxxxxx (ví dụ: 84862171222)
              const prefix = '0' + cleanValue.substring(2, 5);
              return vietnamMobilePrefixes.includes(prefix);
            } else if (
              cleanValue.length === 12 &&
              cleanValue.startsWith('84')
            ) {
              // International format with +: +84xxxxxxxxx (ví dụ: +84862171222)
              const prefix = '0' + cleanValue.substring(2, 5);
              return vietnamMobilePrefixes.includes(prefix);
            }

            return false;
          }
        ),

      // Media files validation
      mediaFiles: yup
        .array()
        .of(yup.string())
        .max(5, t('post.validation.fileCountMax'))
        .test(
          'total-size',
          t('post.validation.totalSizeMax'),
          function (files) {
            if (!files || files.length === 0) return true;
            // Tính tổng dung lượng từ chuỗi base64 (ước lượng)
            const totalSize = files.reduce((acc, base64) => {
              if (!base64) return acc;
              // Dung lượng base64 xấp xỉ 4/3 dung lượng file gốc
              const base64Size = (base64.length * 3) / 4;
              return acc + base64Size;
            }, 0);
            return totalSize <= 8 * 1024 * 1024; // 8MB tổng
          }
        )
        .test(
          'video-count',
          t('post.validation.videoCountMax'),
          function (files) {
            if (!files || files.length === 0) return true;
            // Kiểm tra số lượng video (base64 bắt đầu bằng video MIME type)
            const videoCount = files.filter(
              base64 => base64 && base64.startsWith('data:video/')
            ).length;
            return videoCount <= 1;
          }
        )
        .test(
          'media-type',
          'Chỉ chấp nhận file ảnh hoặc video',
          function (files) {
            if (!files || files.length === 0) return true;
            // Chỉ cho phép base64 bắt đầu bằng image/ hoặc video/
            return files.every(
              base64 =>
                !base64 ||
                base64.startsWith('data:image/') ||
                base64.startsWith('data:video/')
            );
          }
        ),
    })
  );

  // Find room form schema for "Tìm phòng trọ" - validate title, description and roomType
  const findRoomSchema = computed(() =>
    yup.object({
      // Content validation - required fields
      title: yup
        .string()
        .required(t('post.findRoom.validation.titleRequired'))
        .max(150, t('post.findRoom.validation.titleMax')),
      description: yup
        .string()
        .required(t('post.findRoom.validation.descriptionRequired'))
        .max(5000, t('post.findRoom.validation.descriptionMax')),
      roomType: yup.string().required(t('post.validation.roomTypeRequired')),
    })
  );

  return {
    registerSchema,
    loginSchema,
    postFormSchema,
    findRoomSchema,
  };
};
