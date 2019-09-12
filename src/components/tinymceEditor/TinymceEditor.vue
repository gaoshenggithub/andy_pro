<template>
  <div class="tinymce-editor">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick">
    </editor>
  </div>
</template>

<script>

  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver'
  // 编辑器插件plugins  更多插件参考：https://www.tiny.cloud/docs/plugins/
  import 'tinymce/plugins/image'// 插入上传图片插件
  import 'tinymce/plugins/media'// 插入视频插件
  import 'tinymce/plugins/table'// 插入表格插件
  import 'tinymce/plugins/lists'// 列表插件
  import 'tinymce/plugins/wordcount'// 字数统计插件
  import 'tinymce/plugins/link'//插入超链接插件
  import 'tinymce/plugins/searchreplace'//插入查找和替换插件
  import 'tinymce/plugins/fullscreen'//插入全屏插件
  import { tinymceEditorUpLoad, base64Upload } from '@/api/base/upload'
  import { getServerImage, splitBase64, getBase64, extType } from '../../utils/util'
  import * as notification from 'ant-design-vue'

  export default {
    components: {
      Editor
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      plugins: {
        type: [String, Array],
        default: 'searchreplace link lists image media table wordcount fullscreen'
      },
      toolbar: {
        type: [String, Array],
        default: 'undo redo | bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link unlink image media table | searchreplace fullscreen'
      }
    },
    data() {
      return {
        init: {
          language_url: '/tinymce/langs/zh_CN.js',
          language: 'zh_CN',
          skin_url: '/tinymce/skins/ui/oxide',
          height: 200,
          width: '100%',
          plugins: this.plugins,
          toolbar: this.toolbar,
          branding: false,
          menubar: true,
          valid_elements: 'p[style|class],a[style|class],abbr[style|class],b[style|class],blockquote[style|class],br[style|class],code[style|class],col[style|class|span|width],colgroup[style|class|span|width],dd[style|class],del[style|class],div[style|class],dl[style|class],dt[style|class],em[style|class],fieldset[style|class],h1[style|class],h2[style|class],h3[style|class],h4[style|class],h5[style|class],h6[style|class],hr[style|class],i[style|class],img[style|class|alt|src|height|width],ins[style|class],label[style|class],legend[style|class],li[style|class],ol[style|class|start|type],p[style|class],q[style|class],span[style|class],strong[style|class],sub[style|class],sup[style|class],table[style|class|width],tbody[style|class],td[style|class|colspan|height|rowspan|width],tfoot[style|class],th[style|class|colspan|height|rowspan|width],thead[style|class],tr[style|class],ul[style|class]',
          // wordcount_countregex: /([\w\u2019\x27\-\u00C0-\u1FFF]+)|([^\x00-\xff])/g,
          entities: 'nbsp,160,iexcl,161,cent,162,pound,163,curren,164,yen,165,brvbar,166,sect,167,uml,168,copy,169,ordf,170,'
            + 'laquo,171,not,172,shy,173,reg,174,macr,175,deg,176,plusmn,177,sup2,178,sup3,179,acute,180,micro,181,para,182,'
            + 'middot,183,cedil,184,sup1,185,ordm,186,raquo,187,frac14,188,frac12,189,frac34,190,iquest,191,Agrave,192,Aacute,193,'
            + 'Acirc,194,Atilde,195,Auml,196,Aring,197,AElig,198,Ccedil,199,Egrave,200,Eacute,201,Ecirc,202,Euml,203,Igrave,204,'
            + 'Iacute,205,Icirc,206,Iuml,207,ETH,208,Ntilde,209,Ograve,210,Oacute,211,Ocirc,212,Otilde,213,Ouml,214,times,215,'
            + 'Oslash,216,Ugrave,217,Uacute,218,Ucirc,219,Uuml,220,Yacute,221,THORN,222,szlig,223,agrave,224,aacute,225,acirc,226,'
            + 'atilde,227,auml,228,aring,229,aelig,230,ccedil,231,egrave,232,eacute,233,ecirc,234,euml,235,igrave,236,iacute,237,'
            + 'icirc,238,iuml,239,eth,240,ntilde,241,ograve,242,oacute,243,ocirc,244,otilde,245,ouml,246,divide,247,oslash,248,'
            + 'ugrave,249,uacute,250,ucirc,251,uuml,252,yacute,253,thorn,254,yuml,255,fnof,402,Alpha,913,Beta,914,Gamma,915,Delta,916,'
            + 'Epsilon,917,Zeta,918,Eta,919,Theta,920,Iota,921,Kappa,922,Lambda,923,Mu,924,Nu,925,Xi,926,Omicron,927,Pi,928,Rho,929,'
            + 'Sigma,931,Tau,932,Upsilon,933,Phi,934,Chi,935,Psi,936,Omega,937,alpha,945,beta,946,gamma,947,delta,948,epsilon,949,'
            + 'zeta,950,eta,951,theta,952,iota,953,kappa,954,lambda,955,mu,956,nu,957,xi,958,omicron,959,pi,960,rho,961,sigmaf,962,'
            + 'sigma,963,tau,964,upsilon,965,phi,966,chi,967,psi,968,omega,969,thetasym,977,upsih,978,piv,982,bull,8226,hellip,8230,'
            + 'prime,8242,Prime,8243,oline,8254,frasl,8260,weierp,8472,image,8465,real,8476,trade,8482,alefsym,8501,larr,8592,uarr,8593,'
            + 'rarr,8594,darr,8595,harr,8596,crarr,8629,lArr,8656,uArr,8657,rArr,8658,dArr,8659,hArr,8660,forall,8704,part,8706,exist,8707,'
            + 'empty,8709,nabla,8711,isin,8712,notin,8713,ni,8715,prod,8719,sum,8721,minus,8722,lowast,8727,radic,8730,prop,8733,infin,8734,'
            + 'ang,8736,and,8743,or,8744,cap,8745,cup,8746,int,8747,there4,8756,sim,8764,cong,8773,asymp,8776,ne,8800,equiv,8801,le,8804,ge,8805,'
            + 'sub,8834,sup,8835,nsub,8836,sube,8838,supe,8839,oplus,8853,otimes,8855,perp,8869,sdot,8901,lceil,8968,rceil,8969,lfloor,8970,'
            + 'rfloor,8971,lang,9001,rang,9002,loz,9674,spades,9824,clubs,9827,hearts,9829,diams,9830,OElig,338,oelig,339,Scaron,352,scaron,353,'
            + 'Yuml,376,circ,710,tilde,732,ensp,8194,emsp,8195,thinsp,8201,zwnj,8204,zwj,8205,lrm,8206,rlm,8207,ndash,8211,mdash,8212,lsquo,8216,'
            + 'rsquo,8217,sbquo,8218,ldquo,8220,rdquo,8221,bdquo,8222,dagger,8224,Dagger,8225,permil,8240,lsaquo,8249,rsaquo,8250,euro,8364,',
          // CONFIG: StyleSelect
          style_formats: [
            {
              title: '行高',
              items: [
                { title: '1', styles: { 'line-height': '1' }, inline: 'span' },
                { title: '1.5', styles: { 'line-height': '1.5' }, inline: 'span' },
                { title: '2', styles: { 'line-height': '2' }, inline: 'span' },
                { title: '2.5', styles: { 'line-height': '2.5' }, inline: 'span' },
                { title: '3', styles: { 'line-height': '3' }, inline: 'span' },
                { title: '3.5', styles: { 'line-height': '3.5' }, inline: 'span' },
                { title: '4', styles: { 'line-height': '4' }, inline: 'span' }
              ]
            }
          ],
          // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
          // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
          images_upload_handler: (blobInfo, success, failure) => {
            /*const img = 'data:image/jpeg;base64,' + blobInfo.base64()
						success(img)*/
            if (blobInfo.blob().size > 1024 * 1024 * 2) {
              failure('上传失败！上传的文件超过了2M')
            }
            //let formdata = new FormData()
            getBase64(blobInfo.blob(), (imageUrl) => {
              const params = splitBase64(imageUrl)
              if (params.extName === '') {
                notification.error({
                  message: '错误',
                  description: `上传文件只允许上传${extType}`
                })
                return
              }
              base64Upload(params).then(res => {
                if (res.code === '200') {
                  success(getServerImage(res.data))
                } else {
                  failure(res.message)
                }
              })
            })
            //formdata.set('file', blobToDataURL(blobInfo.blob()))
            /*   tinymceEditorUpLoad(formdata).then((res) => {
								 if (res.code === '200') {
									 // success(window.location.origin +  + res.data)
									 success(getServerImage(res.data))
								 } else {
									 failure(res.message)
								 }
							 })*/
          }
        },
        myValue: this.value
      }
    },

    mounted() {
      tinymce.init({})
    },
    methods: {
      // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
      // 需要什么事件可以自己增加
      onClick(e) {
        this.$emit('onClick', e, tinymce)
      },
      // 可以添加一些自己的自定义事件，如清空内容
      clear() {
        this.myValue = ''
      }
    },
    watch: {
      value(newValue) {
        this.myValue = newValue
      },
      myValue(newValue) {
        this.$emit('input', newValue)
      }
    }
  }
</script>

<style scoped>

</style>