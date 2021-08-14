// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  // apiUrl: 'http://192.168.1.10:8888/api',
  // apiUrl: 'http://192.168.43.244:8888/api',
  // apiUrl: 'http://68.183.86.85/api', // QA Server
  // apiUrl: 'https://qaapi.durity.life/api', // QA Server

  // apiUrl: 'https://devapi.durity.life/api', // Dev Server
  // apiUrl: 'http://165.22.209.21:9999/api', // Dev Server
  // apiUrl: 'http://192.168.43.242:8888/api', // RaviShankar IP
  //  apiUrl: 'http://192.168.43.227:8888/api', // Prameela IP
  //  apiUrl: 'http://192.168.43.244:8888/api', // Salih IP


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


  // Encryption keys for Production
  publicKeySupervisor: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsnHT8jfjqzFH3vzhDOhX
ysXsLd0x3SJq2A9n/QYMwgtUDAdiVkASCg0Bh9FPhf9S2EKsCQQ+dzFoUlv7jYDM
ALeI4WBh1UDqvUUQduvRjfscqozl/uX3k2jS/090uqOnQyVw6ZYvGOpTtguZqg61
YpA5e7BF9m/Ixp3Md03vODPTkMki53izEHUdHwttnrIDp4QULXKEcAVVII0Y5jeQ
bSlKCL2+tfXd5M4ryE9bqFl/9oQlBedfBeEKkpe7NDUk8LpE9QVb2K6yls01AlSn
KkrUnWeerOh8jjowQ8FRp58L3TOlglXMBwmlgFhM+45Hfl9N2QuSF9XqZ5wIYZJi
pQIDAQAB
-----END PUBLIC KEY-----
  `,
  publicKeyAgent: `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA00L3ynVK/8uOcC+n0Mu+
aUxgPxdg/hBNIKhieZqyJQb9jeN0J1IKf5rVD8kHAeog7N/B8P4kk/Nxx9UOtulB
uIRmPc/yYhJVefEZOpVNKpUQHU3J59m2MFUOsMrzsIQGXwDnF4I719PkdNGDST9z
oMgzXjDmjV17AzhUugT6W44+mmLtw93cz3ybMGvkMKuLPwBPHypuhC1zckFzOqjE
Ze2wma7fiu65659Te2ZsMWJewfI120tZsxtsXvVDnl48zpbWHijey1jU+DyAtCXG
/ruEbbGXVhAxTOb6jrzTJsxGUo57KLoEP5Bt0utnEvMyRZ2CCKe6368w0E3DK3tm
o5iHxAVU3T3a5eovmei5Z9EALzNUlsxuBQo7KJwBpDqs3+fEUF65BniftCL1VkTG
CpuSzTaG/IwaQVteu7eMMRhF1OTXayJRXYdZqfaojEwsZQFkPMzyXvj202Kkoo7N
MYTzd4zCfiTFpemEvJnp0uwdDDqYNnrv/oycQK8jN9oW7R0xE24CQMjBNsnJ8C8x
k5ES/WpCgnUcrQqPPDyocL364HSibQAtGvR65aoJ0aiN9ltVMydvJ52xUK+RGzig
3GnJedt3XFnTEz3tKNAj69rssD192H7kY8Yp++GXPl961lwBh4sQRO78fi6dOiYG
60Tzz6YNsDRMLA6ObUNWNiMCAwEAAQ==
-----END PUBLIC KEY-----
`,

  // publicKeySupervisor: `-----BEGIN PUBLIC KEY-----
  // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsnHT8jfjqzFH3vzhDOhX
  // ysXsLd0x3SJq2A9n/QYMwgtUDAdiVkASCg0Bh9FPhf9S2EKsCQQ+dzFoUlv7jYDM
  // ALeI4WBh1UDqvUUQduvRjfscqozl/uX3k2jS/090uqOnQyVw6ZYvGOpTtguZqg61
  // YpA5e7BF9m/Ixp3Md03vODPTkMki53izEHUdHwttnrIDp4QULXKEcAVVII0Y5jeQ
  // bSlKCL2+tfXd5M4ryE9bqFl/9oQlBedfBeEKkpe7NDUk8LpE9QVb2K6yls01AlSn
  // KkrUnWeerOh8jjowQ8FRp58L3TOlglXMBwmlgFhM+45Hfl9N2QuSF9XqZ5wIYZJi
  // pQIDAQAB
  // -----END PUBLIC KEY-----
  // `,
  // publicKeyAgent: `-----BEGIN PUBLIC KEY-----
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

