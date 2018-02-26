# FormValidation

## Preface
- 之前在 Angular 与 Vue 的工程中使用表单验证较为灵活，比如 
`<p class="error" data-ng-show="form.sourceType.$error.required && (form.sourceType.$dirty || form.submitted)">必填</p>`
- 在使用 React antd 里提供的表单验证的时候，遇到过很多问题，比如(问题可能和我之前用的 0.12 版本的 antd 有关): 
	- value 值与 state 的绑定经常出问题
	- 事件方法的一些参数问题
	- 可扩展性不够，遇到特殊需求或引用其他人写的组件的时候难以配置
	- 源码用 ts 写，想自己修改也难以入手
	- 与 antd 绑定很牢，修改较为困难，甚至初始化表格数据也要手动(不能根据 state )
	- 很多时候自己手动验证，甚至动态验证，冗余代码较多
	- 需要两套数据同步
	
## Introduction
- FormValidation 只管理状态，页面逻辑获取状态，然后根据状态做相应的样式或文案处理，这样解耦后，可以增加灵活性并用在不同框架的环境里(同时源码也较少比较好修改…… ) 


## Usage
- 初始化 

```
	class MyFormValidation extends FormValidation {
	    constructor(_this) {
		const params = {
		    sceneTitle: {
			props: {
			    // NOTE: can not set value here
			    placeholder: '必填',
			    onChange(event) {
				_this.setState({
				    scene_title: event.target.value
				});
			    }
			},
			validation: {
			    rules: [
				{
				    message: '必填',
				    validator: () => {
					return _this.state.scene_title.length > 0
				    }
				}
			    ]
			}
		    }

		};

		super(_this, params);
	    }
```

- 使用 

``` 
	import FormValidation from './MyFormValidation'
	// init 需要把相对应的命名空间传入，比如 React 中的 this
	form = new FormValidation(this);
	// 使用 将相应 props 注入, 进行绑定，可进行实时判定
	// 注: React 中，value 不能只能这样设置，在 props 中设置会引发问题，尚不知道原因
	<input {...form.sceneTitle.props} value={this.state.scene_title}/>
	// submit 提交时会对所有参数进行校验
	form.submit();
	if (form.valid) {
		// do some stuff
	}
	// 也可以进行手动验证
	form.sceneTitle.validate();
	// 获取状态
	form.sceneTitle.validation.dirty
	form.sceneTitle.validation.valid
	form.sceneTitle.validation.message
	form.valid
```

## TODO
- this 暴露的东西太多，需要人为规范使用，应限制一些功能
- 很多地方默认传入的参数都是合法的，需要进行校验和提示，控制所有的错误
- 针对 React 的一些问题进行了特定的优化，其他框架内使用尚未知道有什么具体的坑
- message 不够人性化，整体检查时候有些麻烦
- 一些更具体的例子

## Others
- 受 JAVA 的影响，所以用的是 OO 的思想，对于 JS 来说不一定是最好的实现，可以根据思路，尝试结合 FP 实现
