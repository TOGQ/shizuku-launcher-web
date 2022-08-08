import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import AWS from 'aws-sdk';
import ServiceQuotas from "aws-sdk/clients/servicequotas";

import "./App.css"
import Shizuku from "./a6kr6-9mvku.webp"

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: 0
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

function App() {
  const regions = ["us-east-2", "us-east-1", "us-west-1", "us-west-2", "af-south-1", "ap-east-1", "ap-southeast-3", "ap-south-1", "ap-northeast-3", "ap-northeast-2", "ap-southeast-1", "ap-southeast-2", "ap-northeast-1", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2", "eu-south-1", "eu-west-3", "eu-north-1", "me-south-1", "sa-east-1"]
  const systems = ["Debian 10", "Debian 11", "Ubuntu 20.04", "Ubuntu 22.04", "Arch Linux"]
  const types = ["t2.micro", "t3.micro", "c5n.large", "t3a.micro", "t2.2xlarge", "t2.xlarge", "t2.large", "t2.medium", "t2.nano", "t3.nano", "t3.small", "t3.medium", "t3.large", "t3.xlarge", "t3.2xlarge", "t3a.nano", "t3a.small", "t3a.medium", "t3a.large", "t3a.xlarge", "t3a.2xlarge", "c5n.xlarge", "c5n.4xlarge", "c5n.2xlarge", "c5.xlarge", "c5.2xlarge", "c5.4xlarge", "c5a.large", "c5a.xlarge", "c5a.2xlarge"]
  const regionsDetail = ["US East (Ohio)", "US East (N. Virginia)", "US West (N. California)", "US West (Oregon)", "Africa (Cape Town)", "Asia Pacific (Hong Kong)", "Asia Pacific (Jakarta)", "Asia Pacific (Mumbai)", "Asia Pacific (Osaka)", "Asia Pacific (Seoul)", "Asia Pacific (Singapore)", "Asia Pacific (Sydney)", "Asia Pacific (Tokyo)", "Canada (Central)", "Europe (Frankfurt)", "Europe (Ireland)", "Europe (London)", "Europe (Milan)", "Europe (Paris)", "Europe (Stockholm)", "Middle East (Bahrain)", "South America (São Paulo)"]

  const [aki, setAki] = useState("");
  const [saki, setSaki] = useState("");
  const [fixedAki, setFixedAki] = useState("");
  const [fixedSaki, setFixedSaki] = useState("");
  const [liRegion, setLiRegion] = useState("");
  const [system, setSystem] = useState("");
  const [type, setType] = useState("");
  const [password, setPassword] = useState("");
  const [gqRegion, setGqRegion] = useState("");
  const [ciRegion, setCiRegion] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [isLaunchingInstance, setIsLaunchingInstance] = useState(false);
  const [isGettingQuota, setIsGettingQuota] = useState(false);
  const [isCheckingInstances, setIsCheckingInstances] = useState(false);
  const [isCheckedInstances, setIsCheckedInstances] = useState(false);
  const [instances, setInstances] = useState([]);

  return (
    <div className="App">
      <Typography id="main-title" sx={{ m: 2 }} variant="h4">幻想世界の小店のAWS开机小助手</Typography>
      <Link sx={{ m: 2 }} underline="hover" variant="body2" href="https://github.com/hiDandelion/shizuku-launcher-web">访问项目仓库</Link>
      <div>
        <img src={Shizuku} />
      </div>
      <div>
        <FormControl sx={{ m: 1, minWidth: 600 }} variant="standard">
          <TextField label="Access Key ID" variant="outlined" size="small" onChange={(e) => {
            setAki(e.target.value);
          }} />
        </FormControl>
      </div>
      <div>
        <FormControl sx={{ m: 1, minWidth: 600 }}>
          <TextField label="Secret Access Key ID" variant="outlined" size="small" onChange={(e) => {
            setSaki(e.target.value);
          }} />
        </FormControl>
      </div>
      <div>
        <FormControl sx={{ m: 2 }} size="small">
          <Button variant="contained" size="small" onClick={() => {
            setFixedAki(aki);
            setFixedSaki(saki);
            if (aki.length !== 20 || saki.length !== 40) {
              setDialogOpen(true);
              setDialogTitle("无效凭证");
              setDialogDescription("请检查凭证格式是否正确");
            }
            else {
              setDialogOpen(true);
              setDialogTitle("保存成功");
              setDialogDescription("您的凭证已保存，请进行下一步操作");
              setInstances([]);
            }
          }}>保存</Button>
        </FormControl>
      </div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography>启动实例</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
              <InputLabel id="select-region-label">地区</InputLabel>
              <Select labelId="select-region-label" label="地区" value={liRegion} onChange={e => {
                setLiRegion(e.target.value);
              }}>
                {regions.map((r, i) =>
                  <MenuItem key={i} value={r}>{regionsDetail[i]}</MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
              <InputLabel id="select-region-label">操作系统</InputLabel>
              <Select labelId="select-system-label" label="操作系统" value={system} onChange={e => {
                setSystem(e.target.value);;
              }}>
                {systems.map((r, i) =>
                  <MenuItem key={i} value={r}>{r}</MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
              <InputLabel id="select-region-label">实例类型</InputLabel>
              <Select labelId="select-type-label" label="实例类型" value={type} onChange={e => {
                setType(e.target.value);
              }}>
                {types.map((r, i) =>
                  <MenuItem key={i} value={r}>{r}</MenuItem>
                )}
              </Select>
            </FormControl>
            <div>
              <FormControl sx={{ m: 1, minWidth: 150 }}>
                <TextField label="密码" variant="outlined" size="small" onChange={(e) => {
                  setPassword(e.target.value);
                }} />
              </FormControl>
            </div>
          </div>
          {isLaunchingInstance ? (<CircularProgress />) : (
            <div>
              <FormControl>
                <Button variant="contained" size="small" onClick={() => {
                  setIsLaunchingInstance(true);
                  if (aki.length !== 20 || saki.length !== 40) {
                    setDialogOpen(true);
                    setDialogTitle("无效凭证");
                    setDialogDescription("请检查凭证格式是否正确");
                    setIsLaunchingInstance(false);
                  }
                  else if (liRegion === "") {
                    setDialogOpen(true);
                    setDialogTitle("选择地区");
                    setDialogDescription("请选择地区后再试一次");
                    setIsLaunchingInstance(false);
                  }
                  else if (system === "") {
                    setDialogOpen(true);
                    setDialogTitle("选择操作系统");
                    setDialogDescription("请选择操作系统后再试一次");
                    setIsLaunchingInstance(false);
                  }
                  else if (type === "") {
                    setDialogOpen(true);
                    setDialogTitle("选择实例类型");
                    setDialogDescription("请选择实例类型后再试一次");
                    setIsLaunchingInstance(false);
                  }
                  else if (password.length < 6) {
                    setDialogOpen(true);
                    setDialogTitle("无效密码");
                    setDialogDescription("请输入6位以上密码后再试一次");
                    setIsLaunchingInstance(false);
                  }
                  else {
                    AWS.config = new AWS.Config();
                    AWS.config.update(
                      {
                        accessKeyId: fixedAki,
                        secretAccessKey: fixedSaki,
                        region: liRegion
                      }
                    );
                    var ec2 = new AWS.EC2();
                    var imageName = ''
                    var imageOwner = ''
                    var imageId = ''
                    if (system === 'Debian 10') {
                      imageName = 'debian-10-amd64-2022*'
                      imageOwner = '136693071363'
                    }
                    if (system === 'Debian 11') {
                      imageName = 'debian-11-amd64-2022*'
                      imageOwner = '136693071363'
                    }
                    if (system === 'Ubuntu 20.04') {
                      imageName = 'ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-2022*'
                      imageOwner = '099720109477'
                    }
                    if (system === 'Ubuntu 22.04') {
                      imageName = 'ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-2022*'
                      imageOwner = '099720109477'
                    }
                    if (system === 'Arch Linux') {
                      imageName = '*'
                      imageOwner = '647457786197'
                    }
                    var imageParams = {
                      Filters: [
                        {
                          Name: 'name',
                          Values: [
                            imageName
                          ]
                        },
                        {
                          Name: 'architecture',
                          Values: [
                            'x86_64'
                          ]
                        }
                      ],
                      Owners: [
                        imageOwner
                      ]
                    }
                    ec2.describeImages(imageParams, function (err, data) {
                      if (err) {
                        console.log(err);
                        setDialogOpen(true);
                        setDialogTitle("启动实例失败");
                        setDialogDescription("查找操作系统镜像时发生错误，请再试一次或联系支持");
                        setIsLaunchingInstance(false);
                      }
                      else {
                        console.log(data)
                        imageId = data.Images[0].ImageId
                        var keyName = String(Date.now())
                        var keyParams = {
                          KeyName: keyName
                        };
                        ec2.createKeyPair(keyParams, function (err, data) {
                          if (err) {
                            console.log(err);
                            setDialogOpen(true);
                            setDialogTitle("启动实例失败");
                            setDialogDescription("创建密钥时发生错误，请再试一次或联系支持");
                            setIsLaunchingInstance(false);
                          } else {
                            var sgParams = {
                              Description: keyName,
                              GroupName: keyName
                            }
                            ec2.createSecurityGroup(sgParams, function (err, data) {
                              if (err) {
                                console.log(err);
                                setDialogOpen(true);
                                setDialogTitle("启动实例失败");
                                setDialogDescription("创建安全组时发生错误，请再试一次或联系支持");
                                setIsLaunchingInstance(false);
                              } else {
                                console.log(data);
                                var groupId = data.GroupId
                                var asgParams = {
                                  GroupId: groupId,
                                  IpPermissions: [
                                    {
                                      FromPort: 0,
                                      IpProtocol: "tcp",
                                      IpRanges: [
                                        {
                                          CidrIp: "0.0.0.0/0",
                                          Description: "All TCP"
                                        }
                                      ],
                                      ToPort: 65535
                                    },
                                    {
                                      FromPort: 0,
                                      IpProtocol: "udp",
                                      IpRanges: [
                                        {
                                          CidrIp: "0.0.0.0/0",
                                          Description: "All UDP"
                                        }
                                      ],
                                      ToPort: 65535
                                    },
                                    {
                                      FromPort: -1,
                                      IpProtocol: "icmp",
                                      IpRanges: [
                                        {
                                          CidrIp: "0.0.0.0/0",
                                          Description: "All ICMP"
                                        }
                                      ],
                                      ToPort: -1
                                    },
                                    {
                                      FromPort: -1,
                                      IpProtocol: "icmpv6",
                                      IpRanges: [
                                        {
                                          CidrIp: "0.0.0.0/0",
                                          Description: "All ICMPV6"
                                        }
                                      ],
                                      ToPort: -1
                                    }
                                  ]
                                };
                                ec2.authorizeSecurityGroupIngress(asgParams, function (err, data) {
                                  if (err) {
                                    console.log(err);
                                    setDialogOpen(true);
                                    setDialogTitle("启动实例失败");
                                    setDialogDescription("修改安全组策略时发生错误，请再试一次或联系支持");
                                    setIsLaunchingInstance(false);
                                  } else {
                                    console.log(data);
                                    var userDataRaw = "#!/bin/bash\necho root:" + password + "|sudo chpasswd root\nsudo rm -rf /etc/ssh/sshd_config\nsudo tee /etc/ssh/sshd_config <<EOF\nClientAliveInterval 120\nSubsystem       sftp    /usr/lib/openssh/sftp-server\nX11Forwarding yes\nPrintMotd no\nChallengeResponseAuthentication no\nPasswordAuthentication yes\nPermitRootLogin yes\nUsePAM yes\nAcceptEnv LANG LC_*\nEOF\nsudo systemctl restart sshd\n"
                                    var userData = btoa(userDataRaw)
                                    var instanceParams = {
                                      ImageId: imageId,
                                      InstanceType: type,
                                      KeyName: keyName,
                                      MinCount: 1,
                                      MaxCount: 1,
                                      SecurityGroupIds: [
                                        groupId
                                      ],
                                      UserData: userData
                                    };
                                    ec2.runInstances(instanceParams, function (err, data) {
                                      if (err) {
                                        console.log(err);
                                        setDialogOpen(true);
                                        setDialogTitle("启动实例失败");
                                        setDialogDescription("启动实例时发生错误，请再试一次或联系支持");
                                        setIsLaunchingInstance(false);
                                      } else {
                                        console.log(data);
                                        console.log({
                                          instanceId: data.Instances[0].InstanceId
                                        });
                                        setDialogOpen(true);
                                        setDialogTitle("启动实例成功");
                                        setDialogDescription("您的新实例id为" + data.Instances[0].InstanceId + "，请30秒后通过查询实例详细信息获得公网ip，在此期间您可以开启另一个实例或进行其他操作");
                                        setIsLaunchingInstance(false);
                                        setInstances([]);
                                      }
                                    });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                }}>执行</Button>
              </FormControl>
            </div>)}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography>查询配额</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
              <InputLabel id="select-region-label">地区</InputLabel>
              <Select labelId="select-region-label" label="地区" value={gqRegion} onChange={e => {
                setGqRegion(e.target.value);
              }}>
                {regions.map((r, i) =>
                  <MenuItem key={i} value={r}>{regionsDetail[i]}</MenuItem>
                )}
              </Select>
            </FormControl>
          </div>
          {isGettingQuota ? (<CircularProgress />) : (
            <div>
              <FormControl>
                <Button variant="contained" size="small" onClick={() => {
                  setIsGettingQuota(true);
                  if (aki.length !== 20 || saki.length !== 40) {
                    setDialogOpen(true);
                    setDialogTitle("无效凭证");
                    setDialogDescription("请检查凭证格式是否正确");
                    setIsGettingQuota(false);
                  }
                  else if (gqRegion === "") {
                    setDialogOpen(true);
                    setDialogTitle("选择地区");
                    setDialogDescription("请选择地区后再试一次");
                    setIsGettingQuota(false);
                  }
                  else {
                    AWS.config = new AWS.Config();
                    AWS.config.update(
                      {
                        accessKeyId: fixedAki,
                        secretAccessKey: fixedSaki,
                        region: gqRegion
                      }
                    );
                    var servicequotas = new AWS.ServiceQuotas();
                    var params = {
                      QuotaCode: 'L-1216C47A',
                      ServiceCode: 'ec2'
                    };
                    servicequotas.getServiceQuota(params, function (err, data) {
                      if (err) {
                        console.error(err);
                        setDialogOpen(true);
                        setDialogTitle("查看配额失败");
                        setDialogDescription("查看配额时发生错误，请再试一次或联系支持");
                        setIsGettingQuota(false);
                      }
                      else {
                        console.log(data);
                        setDialogOpen(true);
                        setDialogTitle("查看配额成功");
                        setDialogDescription("您在该区域的配额为" + String(data.Quota.Value));
                        setIsGettingQuota(false);
                        setIsGettingQuota(false);
                      }
                    });
                  }
                }}>执行</Button>
              </FormControl>
            </div>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography>查看实例详细信息</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
              <InputLabel id="select-region-label">地区</InputLabel>
              <Select labelId="select-region-label" label="地区" value={ciRegion} onChange={e => {
                setCiRegion(e.target.value);
              }}>
                {regions.map((r, i) =>
                  <MenuItem key={i} value={r}>{regionsDetail[i]}</MenuItem>
                )}
              </Select>
            </FormControl>
          </div>
          {isCheckingInstances ? (<CircularProgress />) : (
            <div>
              <FormControl>
                <Button variant="contained" size="small" onClick={() => {
                  setIsCheckingInstances(true);
                  if (aki.length !== 20 || saki.length !== 40) {
                    setDialogOpen(true);
                    setDialogTitle("无效凭证");
                    setDialogDescription("请检查凭证格式是否正确");
                    setIsCheckingInstances(false);
                  }
                  else if (ciRegion === "") {
                    setDialogOpen(true);
                    setDialogTitle("选择地区");
                    setDialogDescription("请选择地区后再试一次");
                    setIsCheckingInstances(false);
                  }
                  else {
                    AWS.config = new AWS.Config();
                    AWS.config.update(
                      {
                        accessKeyId: fixedAki,
                        secretAccessKey: fixedSaki,
                        region: ciRegion
                      }
                    );
                    var ec2 = new AWS.EC2();
                    var params = {}
                    ec2.describeInstances(params, function (err, data) {
                      if (err) {
                        console.error(err);
                        setDialogOpen(true);
                        setDialogTitle("查看实例详细信息失败");
                        setDialogDescription("查看实例详细信息时发生错误，请再试一次或联系支持");
                        setIsCheckingInstances(false);
                      }
                      else {
                        var processedInstances = []
                        data.Reservations.forEach(reservation => {
                          reservation.Instances.forEach(instance => {
                            processedInstances.push({ id: instance.InstanceId, type: instance.InstanceType, ip: instance.PublicIpAddress, platform: instance.PlatformDetails })
                          })
                        })
                        console.log(data);
                        setInstances(processedInstances);
                        setDialogOpen(true);
                        setDialogTitle("查看实例详细信息成功");
                        setDialogDescription("请在查看实例详细信息选项卡中查看您在该区域的实例信息");
                        setIsCheckingInstances(false);
                        setIsCheckedInstances(true);
                      }
                    });
                  }
                }}>执行</Button>
              </FormControl>
            </div>
          )}
          {isCheckedInstances ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>id</TableCell>
                    <TableCell>公网ip</TableCell>
                    <TableCell>实例类型</TableCell>
                    <TableCell>操作系统</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instances.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.ip}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.platform}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (<div />)}
        </AccordionDetails>
      </Accordion>
      <div>
        <Dialog
          open={dialogOpen}
          onClose={() => { setDialogOpen(false); }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {dialogTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialogDescription}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setDialogOpen(false); }}>OK</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>

  );
}

export default App;
