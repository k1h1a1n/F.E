// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //apiUrl: 'http://192.168.43.6:8888/api',
  // apiUrl: 'https://192.168.0.178:9999/api',
 // apiUrl: 'http://192.168.31.147:8888/api',
  //apiUrl: 'http://192.168.43.6:8888/api',
  //apiUrl: 'http://localhost:8888/api',
 //  apiUrl: 'http://68.183.86.85/api', // QA Server
// apiUrl: 'https://qaapi.durity.life/api', // QA Server
  // apiUrl: 'https://devapi.durity.life/api', //dev server
  // apiUrl: 'https://devapi.durity.life/api', // Dev Server

  apiUrl: 'https://api.durity.life/api', // Prod Server

  encryption_iv: 'MXFhejJ3c3gzZWRjNHJmdg==',
  //1qaz2wsx3edc4rfv
  
  
  //'ffc80fea7dd066ab',

  // Encryption keys for Development

  // publicKeySupervisor: `-----BEGIN PUBLIC KEY-----
  // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz+QkVPQmcgFDjtLtzqcM
  // R372JchjgUG8YNykWBAghAaNZ6swy4PdfP96k/pRf5Ug8nHmG4/mzLTUrFJkiLS7
  // 0SfSouXquiDanLm9MPDp/yLJjAdmLe8vsIF5Zve8V2ipYeN/BBKfLgR9/O5PbgdJ
  // Tfra0Bxsi1PflFyKfa6nRFuW0XpXmYyivk/EnAr9MYOORlMIqcLUHQjU8Xauy01b
  // lUNpKDyOjhAbY3DivjrL/1hZRAky7yst7FEVGnQXU1SbMGAGXDd7lWCki8TTPGg2
  // tkThjrmWYXR7YpTi0eV9C/SDZDNIJkwdEFsMJKFWTlWED2JZ/RuxpiHhPsTRj1oq
  // xwIDAQAB
  // -----END PUBLIC KEY-----
  // `,
  // publicKeyAgent: `-----BEGIN PUBLIC KEY-----
  // MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAw5X982qs3A8Vk6ApCGXD
  // vnEZzbckrzqX8JsZeaB8+gE3FLAz8JZoYNNa0SlC6ffrOI0GbJ/4EEtvLeTzOHvP
  // oYr+R01I7oer6ouiO39MobRpFqTn4XVK0AZl1wWSAQ1wl/ndY54XNAhO6Nj7odBI
  // mHDxuAWhYs6hIglWs4ewhq97u4IpOPzdEBAE4n2zYqHOEGtwNU1G/JML4ZYlAA+6
  // YgL1QK7ctQnXQGzxyi1DPUV4Qi6pJv4qQxxpptNz3S/C8Uh6SoU09lntOFS2JqFx
  // IC5mGmcurhum1oSBI4tS2IvpajknVdcpAqzV6vEyG8oaXJaeOxXLjDOxaOPM2QB9
  // 7DML1QFdjPn9SbNimyXghtmQ5IkIDcghYcNP8v1tYZ+1avpanq9sTnRnFmV7nB0t
  // jfTlWvgYqD2USCVLeSbbSQlqAE0sTT1qibjFyzdDoccYuezJ2yjOe7/nfLnTkH6c
  // OD9qTZnWab/SkHsjPnESbvAm8/327Le+bbJkIdR4xcadiRkkikCszxjQmhpUsJOO
  // H5i8CZjB9Jt1uUmsDRfSYMQvgCmxa8B3ukJk2XaQ5I899nQkw6sExS6W7E/S+VdD
  // pZNNUpKrjJmWzxfrxUxcxTf0G0hLjZ6t9asCHXBH84+pyEaknLWd2CQVexdX23vk
  // nZqiDyTvKqPySD3K+4s7rQcCAwEAAQ==
  // -----END PUBLIC KEY-----
  // `

  publicKeySupervisor: `-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0lEFZ0eLxWODhTj1wjhS
  9dJSy4gtHtyYzii4zHm8FTZjOu9XNoUt6eUaBLDCVkemPCh4CCm+BHFLhAbxwZ5w
  J1/PBbtjT5uLjxNZr7Ye6ibgwtW5HY9QjY7hk2qjBH/+x199pZCAmhJD7gDHC60c
  Yjktt068XUEY/hcxEBw4KQ7/3R+2vk0yKGcm6txupfClOqS7VojYPqqI8QdVudEY
  eBDDLOt1/29ehJvGOuuxFX7GKXyLimEL8hSpwb0jrg9HUBFHj7pLOpLKw7C3oANW
  ca72bMY7kM26zO1aNt9l06cI6/gS66rfm3Vn3XaoskkXq2B1ryR6b58sVu7kLn0u
  iQIDAQAB
  -----END PUBLIC KEY-----
  `,
  publicKeyAgent: `-----BEGIN PUBLIC KEY-----
  MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA07s/PA2iOzx711B1aAmX
  jPdELL/fy3F+VHSqVEXhA7cGxpPSIlfJHRz0ykYBM7aTG2xYZE3IYar+hHSCKlUk
  pokNzS1x+25hoEAAcoIY2OzfoUCrcpNg+ujr5oUQN1UWegnBAGiPCjfl7lNlWW7b
  o9TSuSkAqCRJqZODEdhUmQdZCGfyiGyEWXptnPi0NlebKr1mhg6gv/29JnYkfRkQ
  eygoqTKjI6JS1yq6xhbe+vymAQlpeujpjsKqNoUji+jq5bCXPJ/vm/E6J5D2f+23
  zHa32fNEdrH48p9YMbeUpL8+sAasP0+YuHsS1pzXca7vscEUGdc3/zgO3YQeVsCk
  mKrVBPozadk0+PkT5OsCyArqK2DDHmNo8Ug3h+Bdamqa9iXC19naY8QbRVuN7wdc
  IpQBG7KOHIjt6IM0dUkBR56495/gAhgxmojqmrRb+t+7xI0ipFEBuonrghYRBvQq
  j/qhwo3jKZcrCmqS2lHR2IFBPflD3nSGJJxEPF8IhhF9RelDEQxdEel8BGZJT7Fb
  TgAdvPfPtC8v7TwiCDidsZZj1PxGRLS1riULwbID29yEqk25WAGlgZqO1J4X0EIe
  2PEbtRbEzf5l+fDvVkeoSt/S6+it9Eg07Vj80Au1ESg1VVJRBVfn9DxriapWVtNa
  quf8+PIzMcv9hYmuqA+q1nkCAwEAAQ==
  -----END PUBLIC KEY-----
  `,

  // Encryption keys for Production
//   publicKeySupervisor: `-----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsnHT8jfjqzFH3vzhDOhX
// ysXsLd0x3SJq2A9n/QYMwgtUDAdiVkASCg0Bh9FPhf9S2EKsCQQ+dzFoUlv7jYDM
// ALeI4WBh1UDqvUUQduvRjfscqozl/uX3k2jS/090uqOnQyVw6ZYvGOpTtguZqg61
// YpA5e7BF9m/Ixp3Md03vODPTkMki53izEHUdHwttnrIDp4QULXKEcAVVII0Y5jeQ
// bSlKCL2+tfXd5M4ryE9bqFl/9oQlBedfBeEKkpe7NDUk8LpE9QVb2K6yls01AlSn
// KkrUnWeerOh8jjowQ8FRp58L3TOlglXMBwmlgFhM+45Hfl9N2QuSF9XqZ5wIYZJi
// pQIDAQAB
// -----END PUBLIC KEY-----
//   `,
//   publicKeyAgent: `-----BEGIN PUBLIC KEY-----
// MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA00L3ynVK/8uOcC+n0Mu+
// aUxgPxdg/hBNIKhieZqyJQb9jeN0J1IKf5rVD8kHAeog7N/B8P4kk/Nxx9UOtulB
// uIRmPc/yYhJVefEZOpVNKpUQHU3J59m2MFUOsMrzsIQGXwDnF4I719PkdNGDST9z
// oMgzXjDmjV17AzhUugT6W44+mmLtw93cz3ybMGvkMKuLPwBPHypuhC1zckFzOqjE
// Ze2wma7fiu65659Te2ZsMWJewfI120tZsxtsXvVDnl48zpbWHijey1jU+DyAtCXG
// /ruEbbGXVhAxTOb6jrzTJsxGUo57KLoEP5Bt0utnEvMyRZ2CCKe6368w0E3DK3tm
// o5iHxAVU3T3a5eovmei5Z9EALzNUlsxuBQo7KJwBpDqs3+fEUF65BniftCL1VkTG
// CpuSzTaG/IwaQVteu7eMMRhF1OTXayJRXYdZqfaojEwsZQFkPMzyXvj202Kkoo7N
// MYTzd4zCfiTFpemEvJnp0uwdDDqYNnrv/oycQK8jN9oW7R0xE24CQMjBNsnJ8C8x
// k5ES/WpCgnUcrQqPPDyocL364HSibQAtGvR65aoJ0aiN9ltVMydvJ52xUK+RGzig
// 3GnJedt3XFnTEz3tKNAj69rssD192H7kY8Yp++GXPl961lwBh4sQRO78fi6dOiYG
// 60Tzz6YNsDRMLA6ObUNWNiMCAwEAAQ==
// -----END PUBLIC KEY-----
// `,


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

