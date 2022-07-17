task=$(aws ecs list-tasks --cluster social-quakejs-cluster | jq -r ".taskArns[0]")
eni=$(aws ecs describe-tasks --cluster social-quakejs-cluster --tasks $task | jq -r '.tasks[0].attachments[0].details | map(. | select(.name == "networkInterfaceId")) | first | .value')
ip=$(aws ec2 describe-network-interfaces --network-interface-ids $eni | jq -r '.NetworkInterfaces[0].Association.PublicIp')

echo "open http://$ip"